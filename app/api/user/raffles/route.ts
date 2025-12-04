import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/raffles - Listar rifas del usuario autenticado
export async function GET(request: NextRequest) {
    try {
        // TODO: Obtener userId de sesión/token
        // Por ahora, usamos localStorage desde el cliente
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')

        if (!username) {
            return NextResponse.json(
                { error: 'Username es requerido' },
                { status: 400 }
            )
        }

        // Obtener usuario
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Obtener rifas del usuario
        const raffles = await prisma.raffle.findMany({
            where: { organizerId: user.id },
            include: {
                _count: {
                    select: { tickets: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(raffles)
    } catch (error) {
        console.error('Error fetching raffles:', error)
        return NextResponse.json(
            { error: 'Error al obtener rifas' },
            { status: 500 }
        )
    }
}

// POST /api/user/raffles - Crear nueva rifa
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, title, description, price, totalTickets, endDate, imageUrl } = body

        // Validaciones
        if (!username || !title || !description || !price || !totalTickets || !endDate) {
            return NextResponse.json(
                { error: 'Todos los campos requeridos deben estar completos' },
                { status: 400 }
            )
        }

        if (price <= 0) {
            return NextResponse.json(
                { error: 'El precio debe ser mayor a 0' },
                { status: 400 }
            )
        }

        if (totalTickets <= 0 || totalTickets > 10000) {
            return NextResponse.json(
                { error: 'El número de boletos debe estar entre 1 y 10,000' },
                { status: 400 }
            )
        }

        const endDateObj = new Date(endDate)
        if (endDateObj <= new Date()) {
            return NextResponse.json(
                { error: 'La fecha de finalización debe ser futura' },
                { status: 400 }
            )
        }

        // Obtener usuario
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true, plan: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Verificar límites del plan
        const activeRaffles = await prisma.raffle.count({
            where: {
                organizerId: user.id,
                status: 'ACTIVE'
            }
        })

        const planLimits: Record<string, { raffles: number, tickets: number }> = {
            FREE: { raffles: 1, tickets: 100 },
            BASIC: { raffles: 1, tickets: 100 },
            PRO: { raffles: 3, tickets: 1000 },
            PREMIUM: { raffles: 999, tickets: 99999 }
        }

        const limit = planLimits[user.plan] || planLimits.FREE

        if (activeRaffles >= limit.raffles) {
            return NextResponse.json(
                { error: `Tu plan ${user.plan} solo permite ${limit.raffles} rifa(s) activa(s)` },
                { status: 403 }
            )
        }

        if (totalTickets > limit.tickets) {
            return NextResponse.json(
                { error: `Tu plan ${user.plan} solo permite ${limit.tickets} boletos por rifa` },
                { status: 403 }
            )
        }

        // Crear rifa
        const raffle = await prisma.raffle.create({
            data: {
                title,
                description,
                price,
                totalTickets,
                endDate: endDateObj,
                imageUrl,
                organizerId: user.id,
                status: 'DRAFT' // Inicia como borrador
            }
        })

        // Generar boletos automáticamente
        const tickets = []
        for (let i = 1; i <= totalTickets; i++) {
            tickets.push({
                number: i,
                raffleId: raffle.id,
                status: 'AVAILABLE' as const
            })
        }

        await prisma.ticket.createMany({
            data: tickets
        })

        return NextResponse.json({
            success: true,
            raffle
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating raffle:', error)
        
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Ya existe una rifa con ese título' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Error al crear rifa' },
            { status: 500 }
        )
    }
}


