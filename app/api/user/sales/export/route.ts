import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/sales/export - Exportar ventas a CSV
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')
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
            select: { id: true, name: true }
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
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: {
                soldAt: 'asc'
            }
        })

        // Generar CSV
        const csvHeader = 'Fecha,Rifa,Boleto,Cliente,Teléfono,Email,Monto\n'
        const csvRows = sales.map(sale => {
            const date = sale.soldAt ? new Date(sale.soldAt).toLocaleDateString('es-MX') : 'N/A'
            const raffle = sale.raffle.title.replace(/,/g, ' ')
            const ticket = sale.number
            const client = (sale.purchaserName || 'N/A').replace(/,/g, ' ')
            const phone = sale.purchaserPhone || 'N/A'
            const email = sale.purchaserEmail || 'N/A'
            const amount = sale.raffle.price

            return `${date},${raffle},${ticket},${client},${phone},${email},${amount}`
        }).join('\n')

        const csv = csvHeader + csvRows

        // Retornar CSV
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="ventas-${user.name.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })
    } catch (error) {
        console.error('Error exporting sales:', error)
        return NextResponse.json(
            { error: 'Error al exportar ventas' },
            { status: 500 }
        )
    }
}


