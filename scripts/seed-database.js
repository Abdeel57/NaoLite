const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Nombres y apellidos en español
const nombres = [
    'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Miguel', 'Isabel',
    'Francisco', 'Patricia', 'Antonio', 'Rosa', 'Manuel', 'Teresa', 'Pedro', 'Lucía', 'Javier', 'Elena',
    'Diego', 'Sofía', 'Alejandro', 'Marta', 'Fernando', 'Andrea', 'Rafael', 'Cristina', 'Sergio', 'Paula',
    'Roberto', 'Beatriz', 'Ángel', 'Natalia', 'Alberto', 'Silvia', 'Raúl', 'Pilar', 'Enrique', 'Victoria',
    'Rubén', 'Claudia', 'Adrián', 'Mónica', 'Iván', 'Raquel', 'Óscar', 'Alicia', 'Daniel', 'Irene'
];

const apellidos = [
    'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
    'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Chávez', 'Ruiz',
    'Hernández', 'Jiménez', 'Mendoza', 'Vargas', 'Castillo', 'Romero', 'Silva', 'Castro', 'Ramos', 'Moreno',
    'Álvarez', 'Vega', 'Guerrero', 'Medina', 'Campos', 'Navarro', 'Cortés', 'Herrera', 'Aguilar', 'León',
    'Domínguez', 'Vázquez', 'Méndez', 'Santiago', 'Ríos', 'Contreras', 'Estrada', 'Mejía', 'Peña', 'Soto'
];

const planes = ['FREE', 'BASIC', 'PRO', 'PREMIUM'];

const titulosRifas = [
    'iPhone 15 Pro Max', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch OLED',
    'MacBook Air M2', 'iPad Pro', 'AirPods Pro', 'Apple Watch Ultra',
    'Smart TV 65"', 'Bicicleta Eléctrica', 'Scooter Eléctrico', 'Drone DJI',
    'Cámara Canon EOS', 'GoPro Hero 12', 'Consola Retro', 'Auriculares Sony',
    'Tablet Samsung', 'Smartwatch Garmin', 'Teclado Mecánico', 'Mouse Gaming',
    'Silla Gamer', 'Escritorio Gaming', 'Monitor 4K', 'Laptop Gaming',
    'Tarjeta Regalo $500', 'Tarjeta Regalo $1000', 'Viaje a Cancún', 'Viaje a Europa',
    'Cena Romántica', 'Spa para 2', 'Curso Online', 'Membresía Gym Anual'
];

const descripciones = [
    'Producto completamente nuevo, sellado de fábrica',
    'Artículo de última generación con garantía incluida',
    'Premio increíble para el ganador afortunado',
    'Producto premium de alta calidad',
    'Experiencia única e inolvidable',
    'El mejor regalo que podrías recibir',
    'Artículo exclusivo y difícil de conseguir',
    'Producto más vendido del año'
];

// Función para generar nombre aleatorio
function generarNombreCompleto() {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
    const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombre} ${apellido1} ${apellido2}`;
}

// Función para generar username
function generarUsername(nombre) {
    const base = nombre.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/\s+/g, '');
    const numero = Math.floor(Math.random() * 9999);
    return `${base}${numero}`;
}

// Función para generar email
function generarEmail(username) {
    const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];
    return `${username}@${dominio}`;
}

// Función para generar teléfono mexicano
function generarTelefono() {
    const area = Math.floor(Math.random() * 900) + 100;
    const numero = Math.floor(Math.random() * 9000000) + 1000000;
    return `+52 ${area} ${numero}`;
}

// Función para generar bio
function generarBio() {
    const bios = [
        '🎉 Organizador de rifas profesional | Sorteos transparentes',
        '✨ Rifas emocionantes con premios increíbles',
        '🍀 Tu suerte comienza aquí | Rifas verificadas',
        '🎁 Los mejores premios en rifas confiables',
        '🎲 Sorteos justos y transparentes desde 2024',
        '⭐ Organizador certificado | Miles de ganadores felices',
        '🏆 Premios garantizados | Rifas seguras',
        '💎 Rifas premium con los mejores premios'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
}

// Función para generar fecha aleatoria en los últimos 6 meses
function generarFechaReciente() {
    const ahora = new Date();
    const seiseMesesAtras = new Date(ahora.getTime() - (180 * 24 * 60 * 60 * 1000));
    const timestamp = seiseMesesAtras.getTime() + Math.random() * (ahora.getTime() - seiseMesesAtras.getTime());
    return new Date(timestamp);
}

// Función para generar fecha futura (1-30 días)
function generarFechaFutura() {
    const ahora = new Date();
    const dias = Math.floor(Math.random() * 30) + 1;
    return new Date(ahora.getTime() + (dias * 24 * 60 * 60 * 1000));
}

// Función para generar fecha de suscripción
function generarFechaSuscripcion(createdAt) {
    const ahora = new Date();
    const mesesRestantes = Math.floor(Math.random() * 12); // 0-11 meses
    return new Date(ahora.getTime() + (mesesRestantes * 30 * 24 * 60 * 60 * 1000));
}

async function seed() {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    try {
        // Limpiar datos existentes
        console.log('🧹 Limpiando datos existentes...');
        await prisma.ticket.deleteMany({});
        await prisma.raffle.deleteMany({});
        await prisma.user.deleteMany({});
        console.log('✅ Datos limpiados\n');

        // Hash de contraseña por defecto
        const passwordHash = await bcrypt.hash('password123', 10);

        // Crear usuario admin
        console.log('👑 Creando usuario administrador...');
        const admin = await prisma.user.create({
            data: {
                name: 'Admin Principal',
                email: 'admin@naolite.com',
                username: 'admin',
                password: passwordHash,
                phone: '+52 555 123 4567',
                bio: '👨‍💼 Administrador del sistema NaoLite',
                role: 'ADMIN',
                plan: 'PREMIUM',
                subscriptionEnd: new Date('2025-12-31'),
                lastPaymentDate: new Date(),
                notes: 'Usuario administrador principal del sistema'
            }
        });
        console.log(`✅ Admin creado: ${admin.email}\n`);

        // Crear 100 usuarios
        console.log('👥 Creando 100 usuarios...');
        const usuarios = [];

        for (let i = 0; i < 100; i++) {
            const nombre = generarNombreCompleto();
            const username = generarUsername(nombre);
            const email = generarEmail(username);
            const plan = planes[Math.floor(Math.random() * planes.length)];
            const createdAt = generarFechaReciente();

            // Determinar si tiene suscripción activa (70% de probabilidad)
            const tieneSuscripcion = Math.random() > 0.3;
            const subscriptionEnd = tieneSuscripcion ? generarFechaSuscripcion(createdAt) : null;
            const lastPaymentDate = tieneSuscripcion ? generarFechaReciente() : null;

            // Generar notas aleatorias para algunos usuarios
            const notas = Math.random() > 0.7 ? [
                'Cliente frecuente, muy activo',
                'Solicitó factura el mes pasado',
                'Interesado en plan premium',
                'Buen historial de pagos',
                'Requiere seguimiento',
                null
            ][Math.floor(Math.random() * 6)] : null;

            const usuario = await prisma.user.create({
                data: {
                    name: nombre,
                    email: email,
                    username: username,
                    password: passwordHash,
                    phone: generarTelefono(),
                    bio: generarBio(),
                    facebook: Math.random() > 0.5 ? `facebook.com/${username}` : null,
                    instagram: Math.random() > 0.3 ? `@${username}` : null,
                    twitter: Math.random() > 0.7 ? `@${username}` : null,
                    whatsapp: generarTelefono(),
                    role: 'USER',
                    plan: plan,
                    subscriptionEnd: subscriptionEnd,
                    lastPaymentDate: lastPaymentDate,
                    notes: notas,
                    createdAt: createdAt
                }
            });

            usuarios.push(usuario);

            if ((i + 1) % 20 === 0) {
                console.log(`   ✓ ${i + 1}/100 usuarios creados`);
            }
        }
        console.log(`✅ 100 usuarios creados exitosamente\n`);

        // Crear rifas (cada usuario tiene 1-5 rifas)
        console.log('🎰 Creando rifas...');
        let totalRifas = 0;

        for (const usuario of usuarios) {
            const numRifas = Math.floor(Math.random() * 5) + 1; // 1-5 rifas por usuario

            for (let j = 0; j < numRifas; j++) {
                const titulo = titulosRifas[Math.floor(Math.random() * titulosRifas.length)];
                const descripcion = descripciones[Math.floor(Math.random() * descripciones.length)];
                const totalTickets = [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)];
                const precio = [10, 20, 50, 100, 200][Math.floor(Math.random() * 5)];
                const porcentajeVendido = Math.random();
                const soldTickets = Math.floor(totalTickets * porcentajeVendido);

                // Determinar estado
                let status;
                if (porcentajeVendido === 1) {
                    status = 'SOLD_OUT';
                } else if (Math.random() > 0.8) {
                    status = 'DRAFT';
                } else if (Math.random() > 0.9) {
                    status = 'PAUSED';
                } else if (Math.random() > 0.95) {
                    status = 'ENDED';
                } else {
                    status = 'ACTIVE';
                }

                const raffle = await prisma.raffle.create({
                    data: {
                        title: titulo,
                        description: descripcion,
                        price: precio,
                        totalTickets: totalTickets,
                        soldTickets: soldTickets,
                        status: status,
                        startDate: generarFechaReciente(),
                        endDate: generarFechaFutura(),
                        organizerId: usuario.id
                    }
                });

                // Crear tickets para esta rifa
                const tickets = [];
                for (let k = 1; k <= totalTickets; k++) {
                    let ticketStatus = 'AVAILABLE';
                    let purchaserName = null;
                    let purchaserPhone = null;
                    let purchaserEmail = null;
                    let reservedAt = null;
                    let soldAt = null;

                    if (k <= soldTickets) {
                        // Ticket vendido
                        ticketStatus = 'SOLD';
                        purchaserName = generarNombreCompleto();
                        purchaserPhone = generarTelefono();
                        purchaserEmail = generarEmail(generarUsername(purchaserName));
                        soldAt = generarFechaReciente();
                    } else if (Math.random() > 0.9) {
                        // Algunos tickets reservados
                        ticketStatus = 'RESERVED';
                        purchaserName = generarNombreCompleto();
                        purchaserPhone = generarTelefono();
                        purchaserEmail = generarEmail(generarUsername(purchaserName));
                        reservedAt = generarFechaReciente();
                    }

                    tickets.push({
                        number: k,
                        status: ticketStatus,
                        purchaserName: purchaserName,
                        purchaserPhone: purchaserPhone,
                        purchaserEmail: purchaserEmail,
                        reservedAt: reservedAt,
                        soldAt: soldAt,
                        raffleId: raffle.id
                    });
                }

                // Insertar tickets en lotes de 100
                for (let i = 0; i < tickets.length; i += 100) {
                    const batch = tickets.slice(i, i + 100);
                    await prisma.ticket.createMany({
                        data: batch
                    });
                }

                totalRifas++;
            }
        }
        console.log(`✅ ${totalRifas} rifas creadas con sus tickets\n`);

        // Estadísticas finales
        console.log('📊 Estadísticas finales:');
        const totalUsuarios = await prisma.user.count();
        const totalRaffles = await prisma.raffle.count();
        const totalTickets = await prisma.ticket.count();
        const ticketsVendidos = await prisma.ticket.count({ where: { status: 'SOLD' } });
        const ticketsReservados = await prisma.ticket.count({ where: { status: 'RESERVED' } });

        console.log(`   👥 Usuarios: ${totalUsuarios}`);
        console.log(`   🎰 Rifas: ${totalRaffles}`);
        console.log(`   🎫 Tickets totales: ${totalTickets}`);
        console.log(`   ✅ Tickets vendidos: ${ticketsVendidos}`);
        console.log(`   ⏳ Tickets reservados: ${ticketsReservados}`);
        console.log(`   📈 Tasa de venta: ${((ticketsVendidos / totalTickets) * 100).toFixed(2)}%`);

        console.log('\n✨ ¡Seed completado exitosamente!');
        console.log('\n🔐 Credenciales de acceso:');
        console.log('   Email: admin@naolite.com');
        console.log('   Password: password123');
        console.log('\n   Todos los usuarios tienen la contraseña: password123\n');

    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
