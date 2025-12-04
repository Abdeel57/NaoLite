const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const usuarios = await prisma.user.count();
    const rifas = await prisma.raffle.count();
    const tickets = await prisma.ticket.count();
    const ticketsVendidos = await prisma.ticket.count({ where: { status: 'SOLD' } });

    console.log('📊 Datos en la base de datos:');
    console.log(`   👥 Usuarios: ${usuarios}`);
    console.log(`   🎰 Rifas: ${rifas}`);
    console.log(`   🎫 Tickets totales: ${tickets}`);
    console.log(`   ✅ Tickets vendidos: ${ticketsVendidos}`);

    await prisma.$disconnect();
}

checkData();
