import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile/images?username=xxx
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
                logoData: true,
                bannerData: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const response = NextResponse.json(user)

        // Cache images for 1 hour (they rarely change)
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')

        return response
    } catch (error) {
        console.error('Error fetching user images:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
