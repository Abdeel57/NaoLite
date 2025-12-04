import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/user/reservations/[id] - Confirmar pago o cancelar apartado
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { username, action } = body

        if (!username || !action) {
            return NextResponse.json(
                { error: 'Username y action son requeridos' },
                { status: 400 }
            )
        }

        // Validar action
        if (!['confirm', 'cancel'].includes(action)) {
            return NextResponse.json(
                { error: 'Acción inválida. Usa "confirm" o "cancel"' },
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

        // Obtener ticket y verificar ownership de la rifa
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                raffle: {
                    select: {
                        id: true,
                        organizerId: true,
                        soldTickets: true,
                        totalTickets: true
                    }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json(
                { error: 'Apartado no encontrado' },
                { status: 404 }
            )
        }

        if (ticket.raffle.organizerId !== user.id) {
            return NextResponse.json(
                { error: 'No tienes permiso para gestionar este apartado' },
                { status: 403 }
            )
        }

        if (ticket.status !== 'RESERVED') {
            return NextResponse.json(
                { error: 'Este boleto no está apartado' },
                { status: 400 }
            )
        }

        if (action === 'confirm') {
            // Confirmar pago: cambiar a SOLD
            const updatedTicket = await prisma.ticket.update({
                where: { id },
                data: {
                    status: 'SOLD',
                    soldAt: new Date()
                }
            })

            // Actualizar contador de boletos vendidos
            await prisma.raffle.update({
                where: { id: ticket.raffle.id },
                data: {
                    soldTickets: {
                        increment: 1
                    },
                    // Si se vendieron todos, cambiar estado
                    ...(ticket.raffle.soldTickets + 1 >= ticket.raffle.totalTickets && {
                        status: 'SOLD_OUT'
                    })
                }
            })

            return NextResponse.json({
                success: true,
                message: 'Pago confirmado',
                ticket: updatedTicket
            })
        } else {
            // Cancelar: cambiar a AVAILABLE
            const updatedTicket = await prisma.ticket.update({
                where: { id },
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
                message: 'Apartado cancelado',
                ticket: updatedTicket
            })
        }
    } catch (error: any) {
        console.error('Error updating reservation:', error)
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Apartado no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Error al actualizar apartado' },
            { status: 500 }
        )
    }
}


