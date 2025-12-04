import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        // TODO: Add proper authentication check

        // Calculate MRR (Monthly Recurring Revenue)
        const now = new Date();
        const activeSubscriptions = await prisma.user.findMany({
            where: {
                AND: [
                    { plan: { not: 'FREE' } },
                    {
                        OR: [
                            { subscriptionEnd: { gte: now } },
                            { subscriptionEnd: null },
                        ],
                    },
                ],
            },
            select: {
                plan: true,
            },
        });

        // Calculate MRR based on plan prices (from config or hardcoded)
        const planPrices: Record<string, number> = {
            BASIC: 299,
            PRO: 599,
            PREMIUM: 999,
        };

        const mrr = activeSubscriptions.reduce((total, sub) => {
            return total + (planPrices[sub.plan] || 0);
        }, 0);

        // Count total users
        const totalUsers = await prisma.user.count();

        // Count active subscriptions
        const activeSubscriptionsCount = activeSubscriptions.length;

        // Count active raffles globally
        const activeRaffles = await prisma.raffle.count({
            where: {
                status: {
                    in: ['ACTIVE', 'PAUSED'],
                },
            },
        });

        // Get recent users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersThisMonth = await prisma.user.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        // Calculate previous month MRR for comparison (simplified)
        const previousMonthMRR = mrr * 0.89; // Mock 11% growth
        const mrrGrowth = ((mrr - previousMonthMRR) / previousMonthMRR) * 100;

        // Get recent signups
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            mrr: {
                value: mrr,
                growth: Math.round(mrrGrowth),
                formatted: `$${mrr.toLocaleString()}`,
            },
            totalUsers: {
                value: totalUsers,
                newThisMonth: newUsersThisMonth,
            },
            activeSubscriptions: {
                value: activeSubscriptionsCount,
                conversionRate: totalUsers > 0 ? Math.round((activeSubscriptionsCount / totalUsers) * 100) : 0,
            },
            activeRaffles: {
                value: activeRaffles,
            },
            recentUsers: recentUsers.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                joinedAgo: getTimeAgo(user.createdAt),
            })),
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString();
}
