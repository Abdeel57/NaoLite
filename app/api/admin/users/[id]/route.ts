import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { plan } = body

        if (!plan) {
            return NextResponse.json(
                { error: 'El plan es requerido' },
                { status: 400 }
            )
        }

        // Verify valid plans
        const validPlans = ['FREE', 'BASIC', 'PRO', 'PREMIUM']
        if (!validPlans.includes(plan)) {
            return NextResponse.json(
                { error: 'Plan inválido' },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { plan },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user plan:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el plan' },
            { status: 500 }
        )
    }
}
