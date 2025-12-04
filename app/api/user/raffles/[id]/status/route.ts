import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/user/raffles/[id]/status - Cambiar estado de rifa
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { username, status } = body

        if (!username || !status) {
            return NextResponse.json(
                { error: 'Username y status son requeridos' },
                { status: 400 }
            )
        }

        // Validar status
        const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED', 'SOLD_OUT']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Estado inválido' },
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

        // Verificar que la rifa existe y pertenece al usuario
        const raffle = await prisma.raffle.findUnique({
            where: { id },
            select: { organizerId: true, status: true }
        })

        if (!raffle) {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        if (raffle.organizerId !== user.id) {
            return NextResponse.json(
                { error: 'No tienes permiso para cambiar el estado de esta rifa' },
                { status: 403 }
            )
        }

        // Si se va a activar, verificar límites del plan
        if (status === 'ACTIVE' && raffle.status !== 'ACTIVE') {
            const activeRaffles = await prisma.raffle.count({
                where: {
                    organizerId: user.id,
                    status: 'ACTIVE',
                    NOT: { id }
                }
            })

            const planLimits: Record<string, number> = {
                FREE: 1,
                BASIC: 1,
                PRO: 3,
                PREMIUM: 999
            }

            const limit = planLimits[user.plan] || 1

            if (activeRaffles >= limit) {
                return NextResponse.json(
                    { error: `Tu plan ${user.plan} solo permite ${limit} rifa(s) activa(s). Pausa o finaliza otra rifa primero.` },
                    { status: 403 }
                )
            }
        }

        // Actualizar estado
        const updatedRaffle = await prisma.raffle.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({
            success: true,
            raffle: updatedRaffle
        })
    } catch (error: any) {
        console.error('Error updating raffle status:', error)
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Error al cambiar estado de rifa' },
            { status: 500 }
        )
    }
}


