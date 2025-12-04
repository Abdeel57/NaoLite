import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/subscription - Obtener información de suscripción
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

        // Obtener usuario con información de suscripción
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                plan: true,
                subscriptionEnd: true,
                lastPaymentDate: true,
                createdAt: true,
                _count: {
                    select: {
                        raffles: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Calcular estado de suscripción
        let subscriptionStatus = 'active'
        let daysLeft = null

        if (user.subscriptionEnd) {
            const now = new Date()
            const endDate = new Date(user.subscriptionEnd)
            const diffTime = endDate.getTime() - now.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            daysLeft = diffDays

            if (diffDays < 0) {
                subscriptionStatus = 'expired'
            } else if (diffDays <= 7) {
                subscriptionStatus = 'expiring_soon'
            }
        }

        // Información del plan
        const planInfo: Record<string, any> = {
            FREE: { name: 'Gratis', price: 0, raffles: 1, tickets: 100 },
            BASIC: { name: 'Básico', price: 250, raffles: 1, tickets: 100 },
            PRO: { name: 'Pro', price: 399, raffles: 3, tickets: 1000 },
            PREMIUM: { name: 'Premium', price: 799, raffles: 999, tickets: 99999 }
        }

        const currentPlan = planInfo[user.plan] || planInfo.FREE

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username
            },
            subscription: {
                plan: user.plan,
                planInfo: currentPlan,
                status: subscriptionStatus,
                subscriptionEnd: user.subscriptionEnd,
                lastPaymentDate: user.lastPaymentDate,
                daysLeft,
                totalRaffles: user._count.raffles
            }
        })
    } catch (error) {
        console.error('Error fetching subscription:', error)
        return NextResponse.json(
            { error: 'Error al obtener información de suscripción' },
            { status: 500 }
        )
    }
}


