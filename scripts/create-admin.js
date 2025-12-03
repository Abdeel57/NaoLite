// Script to create super admin user
// Run with: node scripts/create-admin.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSuperAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        })

        if (existingAdmin) {
            console.log('✅ Super admin already exists:', existingAdmin.username)
            return
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash('admin123', 10) // CHANGE THIS PASSWORD!

        const admin = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: 'admin@naolite.com',
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
                plan: 'PREMIUM'
            }
        })

        console.log('✅ Super admin created successfully!')
        console.log('Username:', admin.username)
        console.log('Password: admin123')
        console.log('\n⚠️  IMPORTANT: Change this password after first login!')
    } catch (error) {
        console.error('❌ Error creating super admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createSuperAdmin()
