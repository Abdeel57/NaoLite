import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PUT /api/user/password - Cambiar contraseña
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, currentPassword, newPassword } = body

        // Validaciones
        if (!username || !currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            )
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { error: 'La nueva contraseña debe ser diferente a la actual' },
                { status: 400 }
            )
        }

        // Obtener usuario
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                password: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Verificar contraseña actual
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'La contraseña actual es incorrecta' },
                { status: 401 }
            )
        }

        // Hash nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Actualizar contraseña
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return NextResponse.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        })
    } catch (error) {
        console.error('Error updating password:', error)
        return NextResponse.json(
            { error: 'Error al cambiar contraseña' },
            { status: 500 }
        )
    }
}


