import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, username, password, phone } = body

        // Validate required fields
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'El email o nombre de usuario ya está registrado' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                phone: phone || null,
                role: 'USER',
                plan: 'FREE'
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                plan: true,
                createdAt: true
            }
        })

        return NextResponse.json({
            success: true,
            user
        })
    } catch (error) {
        console.error('Error in signup:', error)
        return NextResponse.json(
            { error: 'Error al crear el usuario' },
            { status: 500 }
        )
    }
}
