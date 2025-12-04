const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.user.count()
        console.log(`Total users in DB: ${count}`)

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, plan: true }
        })
        console.log('Users found:', JSON.stringify(users, null, 2))
    } catch (e) {
        console.error('Error querying DB:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
