// Script para verificar datos en la base de datos de producción
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function checkUserData() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'rifas-el-randy' }, // Cambia por tu username
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                primaryColor: true,
                paymentCards: true,
                faqs: true,
                logoData: true,
                bannerData: true,
                updatedAt: true
            }
        })

        if (!user) {
            console.log('❌ Usuario no encontrado')
            return
        }

        console.log('\n📊 Datos del usuario en la base de datos:\n')
        console.log('Username:', user.username)
        console.log('Name:', user.name)
        console.log('Bio:', user.bio?.substring(0, 50) + '...')
        console.log('Primary Color:', user.primaryColor)
        console.log('Has Logo:', !!user.logoData, user.logoData ? `(${user.logoData.length} chars)` : '')
        console.log('Has Banner:', !!user.bannerData, user.bannerData ? `(${user.bannerData.length} chars)` : '')
        console.log('\n💳 Payment Cards:')
        if (user.paymentCards) {
            const cards = JSON.parse(user.paymentCards)
            console.log(`  Total: ${cards.length}`)
            cards.forEach((card: any, i: number) => {
                console.log(`  ${i + 1}. ${card.bank} - ${card.accountNumber}`)
            })
        } else {
            console.log('  ❌ No hay tarjetas guardadas')
        }

        console.log('\n❓ FAQs:')
        if (user.faqs) {
            const faqs = JSON.parse(user.faqs)
            console.log(`  Total: ${faqs.length}`)
            faqs.forEach((faq: any, i: number) => {
                console.log(`  ${i + 1}. ${faq.question}`)
            })
        } else {
            console.log('  ❌ No hay FAQs guardadas')
        }

        console.log('\n🕐 Última actualización:', user.updatedAt)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUserData()
