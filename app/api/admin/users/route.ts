import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        // TODO: Add proper authentication check

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = (page - 1) * limit;

        // Fetch users with their raffle count and recent raffles
        const users = await prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone: true,
                whatsapp: true,
                role: true,
                plan: true,
                subscriptionEnd: true,
                lastPaymentDate: true,
                notes: true,
                createdAt: true,
                _count: {
                    select: {
                        raffles: true,
                    },
                },
                raffles: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform data for frontend
        const transformedUsers = users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            phone: user.phone,
            whatsapp: user.whatsapp,
            plan: user.plan,
            role: user.role,
            status: 'active', // TODO: Calculate based on subscription
            joined: user.createdAt.toISOString(),
            rafflesCount: user._count.raffles,
            raffles: user.raffles,
            subscriptionEnd: user.subscriptionEnd?.toISOString(),
            lastPaymentDate: user.lastPaymentDate?.toISOString(),
            notes: user.notes,
        }));

        return NextResponse.json(transformedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
