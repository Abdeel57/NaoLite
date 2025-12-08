// Script to reset admin password or create new admin
// Run with: node scripts/reset-admin-password.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
    try {
        // Check if admin exists
        const existingAdmin = await prisma.user.findFirst({
            where: { 
                OR: [
                    { username: 'admin' },
                    { role: 'ADMIN' }
                ]
            }
        })

        const newPassword = 'SuperAdmin2024!'
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        if (existingAdmin) {
            console.log('🔄 Admin encontrado, actualizando contraseña...')
            
            const updatedAdmin = await prisma.user.update({
                where: { id: existingAdmin.id },
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                    plan: 'PREMIUM'
                }
            })

            console.log('✅ Contraseña de admin actualizada!')
            console.log('\n📋 NUEVAS CREDENCIALES:')
            console.log('Username:', updatedAdmin.username)
            console.log('Email:', updatedAdmin.email)
            console.log('Password:', newPassword)
        } else {
            console.log('👤 No se encontró admin, creando uno nuevo...')
            
            const newAdmin = await prisma.user.create({
                data: {
                    name: 'Super Admin',
                    email: 'admin@naolite.com',
                    username: 'admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                    plan: 'PREMIUM'
                }
            })

            console.log('✅ Super admin creado!')
            console.log('\n📋 CREDENCIALES:')
            console.log('Username:', newAdmin.username)
            console.log('Email:', newAdmin.email)
            console.log('Password:', newPassword)
        }

        console.log('\n⚠️  Guarda estas credenciales en un lugar seguro!')
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

resetAdminPassword()

