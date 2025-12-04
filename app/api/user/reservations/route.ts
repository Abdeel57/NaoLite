import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/reservations - Listar apartados del usuario
export async function GET(request: NextRequest) {
    try {
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

        // Obtener apartados de las rifas del usuario
        const reservations = await prisma.ticket.findMany({
            where: {
                status: 'RESERVED',
                raffle: {
                    organizerId: user.id
                }
            },
            include: {
                raffle: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: {
                reservedAt: 'desc'
            }
        })

        // Calcular tiempo restante
        const reservationsWithTime = reservations.map(res => {
            const reservedAt = res.reservedAt ? new Date(res.reservedAt) : new Date()
            const now = new Date()
            const expiresAt = new Date(reservedAt.getTime() + 24 * 60 * 60 * 1000) // 24 horas
            const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60)))
            const isExpired = minutesLeft === 0

            return {
                ...res,
                minutesLeft,
                isExpired,
                expiresAt
            }
        })

        return NextResponse.json(reservationsWithTime)
    } catch (error) {
        console.error('Error fetching reservations:', error)
        return NextResponse.json(
            { error: 'Error al obtener apartados' },
            { status: 500 }
        )
    }
}

// DELETE /api/user/reservations/expired - Limpiar apartados vencidos
export async function DELETE(request: NextRequest) {
    try {
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

        // Calcular tiempo de expiración (24 horas)
        const expirationTime = new Date()
        expirationTime.setHours(expirationTime.getHours() - 24)

        // Encontrar apartados vencidos
        const expiredReservations = await prisma.ticket.findMany({
            where: {
                status: 'RESERVED',
                reservedAt: {
                    lt: expirationTime
                },
                raffle: {
                    organizerId: user.id
                }
            },
            select: { id: true }
        })

        // Cambiar estado a AVAILABLE
        const result = await prisma.ticket.updateMany({
            where: {
                id: {
                    in: expiredReservations.map(r => r.id)
                }
            },
            data: {
                status: 'AVAILABLE',
                purchaserName: null,
                purchaserPhone: null,
                purchaserEmail: null,
                reservedAt: null
            }
        })

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `${result.count} apartados vencidos limpiados`
        })
    } catch (error) {
        console.error('Error deleting expired reservations:', error)
        return NextResponse.json(
            { error: 'Error al limpiar apartados vencidos' },
            { status: 500 }
        )
    }
}


