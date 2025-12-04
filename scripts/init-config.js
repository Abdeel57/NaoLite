const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Default configuration values
const DEFAULT_CONFIG = {
    // General
    site_name: 'NaoLite',
    site_description: 'Plataforma de rifas en línea',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    logo_url: '/logo.png',
    favicon_url: '/favicon.ico',
    default_language: 'es',

    // Plans
    plan_free_max_raffles: '3',
    plan_free_max_tickets: '100',
    plan_free_commission: '10',

    plan_basic_price_monthly: '299',
    plan_basic_price_yearly: '2990',
    plan_basic_max_raffles: '10',
    plan_basic_max_tickets: '500',
    plan_basic_commission: '8',
    plan_basic_trial_days: '7',

    plan_pro_price_monthly: '599',
    plan_pro_price_yearly: '5990',
    plan_pro_max_raffles: '50',
    plan_pro_max_tickets: '2000',
    plan_pro_commission: '5',
    plan_pro_trial_days: '14',

    plan_premium_price_monthly: '999',
    plan_premium_price_yearly: '9990',
    plan_premium_max_raffles: 'unlimited',
    plan_premium_max_tickets: 'unlimited',
    plan_premium_commission: '3',
    plan_premium_trial_days: '30',

    // Payments
    payment_whatsapp_number: '',
    payment_bank_name: '',
    payment_bank_account: '',
    payment_bank_clabe: '',
    payment_bank_holder: '',
    payment_platform_commission: '5',
    payment_currency: 'MXN',

    // Notifications
    notification_email_host: '',
    notification_email_port: '587',
    notification_email_user: '',
    notification_email_password: '',
    notification_email_from: '',
    notification_whatsapp_number: '',
};

async function initialize() {
    console.log('🔧 Inicializando configuración predeterminada...\n');

    try {
        const existingConfigs = await prisma.siteConfig.findMany();

        if (existingConfigs.length === 0) {
            const configEntries = Object.entries(DEFAULT_CONFIG).map(([key, value]) => {
                let category = 'general';
                let type = 'text';

                if (key.startsWith('plan_')) category = 'plans';
                else if (key.startsWith('payment_')) category = 'payments';
                else if (key.startsWith('notification_')) category = 'notifications';

                if (key.includes('color')) type = 'color';
                else if (key.includes('url')) type = 'image';
                else if (key.includes('price') || key.includes('max_') || key.includes('commission')) type = 'number';

                return {
                    key,
                    value,
                    category,
                    type,
                };
            });

            await prisma.siteConfig.createMany({
                data: configEntries,
            });

            console.log('✅ Configuración inicializada exitosamente\n');
        } else {
            console.log('ℹ️  La configuración ya existe, saltando inicialización\n');
        }

        // Mostrar configuraciones creadas
        const configs = await prisma.siteConfig.findMany();
        console.log(`📊 Total de configuraciones: ${configs.length}\n`);

        const categories = [...new Set(configs.map(c => c.category))];
        console.log('📁 Categorías:');
        categories.forEach(cat => {
            const count = configs.filter(c => c.category === cat).length;
            console.log(`   - ${cat}: ${count} configuraciones`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

initialize();
