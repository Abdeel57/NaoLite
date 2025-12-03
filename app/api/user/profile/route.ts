import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile?username=xxx
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
                bio: true,
                avatarUrl: true,
                facebook: true,
                instagram: true,
                twitter: true,
                whatsapp: true,
                plan: true,
                createdAt: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, name, bio, email, phone, facebook, instagram, twitter, whatsapp, avatarUrl } = body

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            )
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { username },
            data: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
                ...(facebook !== undefined && { facebook }),
                ...(instagram !== undefined && { instagram }),
                ...(twitter !== undefined && { twitter }),
                ...(whatsapp !== undefined && { whatsapp }),
                ...(avatarUrl !== undefined && { avatarUrl }),
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phone: true,
                bio: true,
                avatarUrl: true,
                facebook: true,
                instagram: true,
                twitter: true,
                whatsapp: true,
                plan: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
