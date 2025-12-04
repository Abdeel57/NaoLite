import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { action, notes } = body

        if (!action) {
            return NextResponse.json(
                { error: 'Acción requerida' },
                { status: 400 }
            )
        }

        let updateData: any = {}
        const now = new Date()

        // Handle different actions
        if (action === 'REGISTER_PAYMENT') {
            // Get current user to check current subscription end
            const currentUser = await prisma.user.findUnique({
                where: { id },
                select: { subscriptionEnd: true }
            })

            let newEndDate = new Date()

            // If subscription is still active, add 30 days to the end date
            // If expired or null, start 30 days from now
            if (currentUser?.subscriptionEnd && currentUser.subscriptionEnd > now) {
                newEndDate = new Date(currentUser.subscriptionEnd)
                newEndDate.setDate(newEndDate.getDate() + 30)
            } else {
                newEndDate.setDate(newEndDate.getDate() + 30)
            }

            updateData = {
                lastPaymentDate: now,
                subscriptionEnd: newEndDate,
                status: 'active' // Ensure user is active
            }
        } else if (action === 'UPDATE_NOTES') {
            updateData = { notes }
        } else {
            return NextResponse.json(
                { error: 'Acción no válida' },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                subscriptionEnd: true,
                lastPaymentDate: true,
                notes: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating subscription:', error)
        return NextResponse.json(
            { error: 'Error al actualizar suscripción' },
            { status: 500 }
        )
    }
}
