import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile?username=xxx
export async function GET(request: NextRequest) {
    const start = Date.now()
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            )
        }

        console.log(`[Profile API] Fetching profile for: ${username}`)
        const dbStart = Date.now()
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
                // Images excluded for performance - use /api/user/profile/images instead
                // logoData: true,
                // bannerData: true,
                primaryColor: true,
                paymentCards: true,
                faqs: true,
                createdAt: true,
            },
        })
        const dbDuration = Date.now() - dbStart
        console.log(`[Profile API] DB Query took: ${dbDuration}ms`)

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const response = NextResponse.json(user)

        // Calculate approximate size
        const size = JSON.stringify(user).length
        console.log(`[Profile API] Response size: ${(size / 1024).toFixed(2)} KB`)
        console.log(`[Profile API] Total duration: ${Date.now() - start}ms`)

        // Cache for 60 seconds, revalidate in background
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

        return response
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
    const start = Date.now()
    console.log('[Profile API] ========== PUT REQUEST START ==========')
    console.log('[Profile API] PUT request received at:', new Date().toISOString())
    try {
        const body = await request.json()
        console.log(`[Profile API] Body parsed. Size: ${JSON.stringify(body).length} bytes`)
        console.log('[Profile API] Request body keys:', Object.keys(body))

        const {
            username, name, bio, email, phone,
            facebook, instagram, twitter, whatsapp,
            avatarUrl, logoData, bannerData, primaryColor,
            paymentCards, faqs
        } = body

        console.log('[Profile API] Extracted fields:', {
            username,
            hasName: !!name,
            hasBio: !!bio,
            hasEmail: !!email,
            hasPhone: !!phone,
            hasPrimaryColor: !!primaryColor,
            hasPaymentCards: !!paymentCards,
            hasFaqs: !!faqs,
            paymentCardsType: typeof paymentCards,
            faqsType: typeof faqs
        })

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

        // Validar tamaño de imágenes (aprox 2MB = ~2.8MB en base64)
        const MAX_SIZE = 2.8 * 1024 * 1024;
        if (logoData && logoData.length > MAX_SIZE) {
            return NextResponse.json(
                { error: 'El logo es demasiado grande (Máx 2MB)' },
                { status: 400 }
            )
        }
        if (bannerData && bannerData.length > MAX_SIZE) {
            return NextResponse.json(
                { error: 'El banner es demasiado grande (Máx 2MB)' },
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
        console.log(`[Profile API] Starting DB update for user: ${username}`)

        const updateData = {
            ...(name && { name }),
            ...(bio !== undefined && { bio }),
            ...(email && { email }),
            ...(phone !== undefined && { phone }),
            ...(facebook !== undefined && { facebook }),
            ...(instagram !== undefined && { instagram }),
            ...(twitter !== undefined && { twitter }),
            ...(whatsapp !== undefined && { whatsapp }),
            ...(avatarUrl !== undefined && { avatarUrl }),
            ...(logoData !== undefined && { logoData }),
            ...(bannerData !== undefined && { bannerData }),
            ...(primaryColor !== undefined && { primaryColor }),
            ...(paymentCards !== undefined && { paymentCards }),
            ...(faqs !== undefined && { faqs }),
        };

        console.log('[Profile API] Update data fields:', Object.keys(updateData))
        console.log('[Profile API] PaymentCards value:', paymentCards ? `${paymentCards.substring(0, 100)}...` : 'null')
        console.log('[Profile API] FAQs value:', faqs ? `${faqs.substring(0, 100)}...` : 'null')

        const dbStart = Date.now()
        const updatedUser = await prisma.user.update({
            where: { username },
            data: updateData,
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
                // Exclude heavy image data from response to speed up save
                // logoData: true, 
                // bannerData: true,
                primaryColor: true,
                paymentCards: true,
                faqs: true,
                updatedAt: true,
            },
        })
        const dbDuration = Date.now() - dbStart
        console.log(`[Profile API] DB update took: ${dbDuration}ms`)
        console.log('[Profile API] Update successful! Saved fields:', {
            hasPaymentCards: !!updatedUser.paymentCards,
            hasFaqs: !!updatedUser.faqs,
            paymentCardsLength: updatedUser.paymentCards?.length || 0,
            faqsLength: updatedUser.faqs?.length || 0
        })

        const response = NextResponse.json({
            success: true,
            user: updatedUser
        })

        console.log('[Profile API] ========== PUT REQUEST END (SUCCESS) ==========')
        console.log(`[Profile API] Total duration: ${Date.now() - start}ms`)

        console.log(`[Profile API] PUT total duration: ${Date.now() - start}ms`)
        return response
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
