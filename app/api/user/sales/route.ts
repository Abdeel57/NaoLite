import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/sales - Listar ventas del usuario con filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')
        const raffleId = searchParams.get('raffleId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

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

        // Construir filtros
        const where: any = {
            status: 'SOLD',
            raffle: {
                organizerId: user.id
            }
        }

        if (raffleId) {
            where.raffleId = raffleId
        }

        if (startDate || endDate) {
            where.soldAt = {}
            if (startDate) {
                where.soldAt.gte = new Date(startDate)
            }
            if (endDate) {
                const endDateObj = new Date(endDate)
                endDateObj.setHours(23, 59, 59, 999)
                where.soldAt.lte = endDateObj
            }
        }

        // Obtener ventas
        const sales = await prisma.ticket.findMany({
            where,
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
                soldAt: 'desc'
            }
        })

        // Calcular estadísticas
        const totalSales = sales.reduce((sum, sale) => sum + sale.raffle.price, 0)
        const totalTickets = sales.length

        // Estadísticas del mes actual
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthSales = sales.filter(sale => {
            const soldAt = sale.soldAt ? new Date(sale.soldAt) : new Date()
            return soldAt >= firstDayOfMonth
        })
        const monthTotal = monthSales.reduce((sum, sale) => sum + sale.raffle.price, 0)

        return NextResponse.json({
            sales,
            stats: {
                totalSales,
                totalTickets,
                monthTotal,
                monthTickets: monthSales.length
            }
        })
    } catch (error) {
        console.error('Error fetching sales:', error)
        return NextResponse.json(
            { error: 'Error al obtener ventas' },
            { status: 500 }
        )
    }
}


