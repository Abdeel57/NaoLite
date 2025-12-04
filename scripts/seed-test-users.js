const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando carga de datos de prueba...')

    const password = await bcrypt.hash('123456', 10)

    const testUsers = [
        {
            name: 'Gimnasio Hércules',
            email: 'gym@test.com',
            username: 'gym_hercules',
            plan: 'PREMIUM',
            role: 'USER',
            subscriptionEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Vencido hace 5 días
            notes: 'Cliente frecuente, suele pagar en efectivo.',
        },
        {
            name: 'Escuela de Danza Luna',
            email: 'danza@test.com',
            username: 'danzaluna',
            plan: 'PRO',
            role: 'USER',
            subscriptionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Vence en 2 días
            notes: 'Recordar enviar factura.',
        },
        {
            name: 'Liga de Fútbol Norte',
            email: 'futbol@test.com',
            username: 'liganorte',
            plan: 'BASIC',
            role: 'USER',
            subscriptionEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Al corriente
            notes: '',
        },
        {
            name: 'Rifas Benéficas AC',
            email: 'ong@test.com',
            username: 'rifas_ong',
            plan: 'FREE',
            role: 'USER',
            subscriptionEnd: null, // Sin suscripción
            notes: 'Interesados en plan Pro.',
        }
    ]

    for (const user of testUsers) {
        const exists = await prisma.user.findUnique({
            where: { email: user.email }
        })

        if (!exists) {
            await prisma.user.create({
                data: {
                    ...user,
                    password,
                }
            })
            console.log(`✅ Usuario creado: ${user.name} (${user.username})`)
        } else {
            console.log(`⚠️ Usuario ya existe: ${user.name}`)
        }
    }

    console.log('🏁 Carga de datos completada.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
