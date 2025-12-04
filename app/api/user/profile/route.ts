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

        // Validaciones
        if (!username) {
            return NextResponse.json(
                { error: 'Username es requerido' },
                { status: 400 }
            )
        }

        // Validar formato de email si se proporciona
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Formato de email inválido' },
                { status: 400 }
            )
        }

        // Validar longitud de bio si se proporciona
        if (bio !== undefined && bio !== null && bio.length > 500) {
            return NextResponse.json(
                { error: 'La biografía no puede exceder 500 caracteres' },
                { status: 400 }
            )
        }

        // Verificar si el usuario existe
        const existingUser = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Si se cambia el email, verificar que no esté en uso por otro usuario
        if (email) {
            const emailInUse = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { username }
                }
            })

            if (emailInUse) {
                return NextResponse.json(
                    { error: 'El email ya está en uso por otro usuario' },
                    { status: 400 }
                )
            }
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

        return NextResponse.json({
            success: true,
            user: updatedUser
        })
    } catch (error: any) {
        console.error('Error updating user profile:', error)
        
        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'El email ya está en uso' },
                { status: 400 }
            )
        }
        
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Error al actualizar el perfil' },
            { status: 500 }
        )
    }
}
