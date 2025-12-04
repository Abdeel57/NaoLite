import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/raffles/[id] - Obtener rifa específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // Obtener rifa
        const raffle = await prisma.raffle.findUnique({
            where: { id },
            include: {
                tickets: {
                    select: {
                        id: true,
                        number: true,
                        status: true,
                        purchaserName: true,
                        purchaserPhone: true,
                        soldAt: true
                    }
                },
                _count: {
                    select: { tickets: true }
                }
            }
        })

        if (!raffle) {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        // Verificar ownership
        if (raffle.organizerId !== user.id) {
            return NextResponse.json(
                { error: 'No tienes permiso para ver esta rifa' },
                { status: 403 }
            )
        }

        return NextResponse.json(raffle)
    } catch (error) {
        console.error('Error fetching raffle:', error)
        return NextResponse.json(
            { error: 'Error al obtener rifa' },
            { status: 500 }
        )
    }
}

// PUT /api/user/raffles/[id] - Actualizar rifa
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { username, title, description, price, endDate, imageUrl } = body

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

        // Verificar que la rifa existe y pertenece al usuario
        const raffle = await prisma.raffle.findUnique({
            where: { id },
            select: { organizerId: true, soldTickets: true }
        })

        if (!raffle) {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        if (raffle.organizerId !== user.id) {
            return NextResponse.json(
                { error: 'No tienes permiso para editar esta rifa' },
                { status: 403 }
            )
        }

        // Validaciones
        if (price !== undefined && price <= 0) {
            return NextResponse.json(
                { error: 'El precio debe ser mayor a 0' },
                { status: 400 }
            )
        }

        if (endDate) {
            const endDateObj = new Date(endDate)
            if (endDateObj <= new Date()) {
                return NextResponse.json(
                    { error: 'La fecha de finalización debe ser futura' },
                    { status: 400 }
                )
            }
        }

        // Actualizar rifa
        const updatedRaffle = await prisma.raffle.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(price !== undefined && { price }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(imageUrl !== undefined && { imageUrl })
            }
        })

        return NextResponse.json({
            success: true,
            raffle: updatedRaffle
        })
    } catch (error: any) {
        console.error('Error updating raffle:', error)
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Error al actualizar rifa' },
            { status: 500 }
        )
    }
}

// DELETE /api/user/raffles/[id] - Eliminar rifa
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        // Verificar que la rifa existe y pertenece al usuario
        const raffle = await prisma.raffle.findUnique({
            where: { id },
            select: { organizerId: true, soldTickets: true }
        })

        if (!raffle) {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        if (raffle.organizerId !== user.id) {
            return NextResponse.json(
                { error: 'No tienes permiso para eliminar esta rifa' },
                { status: 403 }
            )
        }

        // No permitir eliminar si tiene boletos vendidos
        if (raffle.soldTickets > 0) {
            return NextResponse.json(
                { error: 'No puedes eliminar una rifa con boletos vendidos' },
                { status: 400 }
            )
        }

        // Eliminar tickets primero (por la relación)
        await prisma.ticket.deleteMany({
            where: { raffleId: id }
        })

        // Eliminar rifa
        await prisma.raffle.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Rifa eliminada correctamente'
        })
    } catch (error: any) {
        console.error('Error deleting raffle:', error)
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Rifa no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Error al eliminar rifa' },
            { status: 500 }
        )
    }
}


