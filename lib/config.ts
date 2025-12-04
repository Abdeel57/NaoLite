import { PrismaClient } from '@prisma/client';

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

/**
 * Get a configuration value by key
 */
export async function getConfig(key: string): Promise<string | null> {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key },
        });

        return config?.value || DEFAULT_CONFIG[key as keyof typeof DEFAULT_CONFIG] || null;
    } catch (error) {
        console.error('Error getting config:', error);
        return DEFAULT_CONFIG[key as keyof typeof DEFAULT_CONFIG] || null;
    }
}

/**
 * Get all configurations by category
 */
export async function getConfigByCategory(category: string): Promise<Record<string, string>> {
    try {
        const configs = await prisma.siteConfig.findMany({
            where: { category },
        });

        const result: Record<string, string> = {};
        configs.forEach(config => {
            result[config.key] = config.value;
        });

        // Add defaults for missing keys
        Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
            if (key.startsWith(category) && !result[key]) {
                result[key] = value;
            }
        });

        return result;
    } catch (error) {
        console.error('Error getting config by category:', error);
        return {};
    }
}

/**
 * Get all configurations
 */
export async function getAllConfig(): Promise<Record<string, string>> {
    try {
        const configs = await prisma.siteConfig.findMany();

        const result: Record<string, string> = { ...DEFAULT_CONFIG };
        configs.forEach(config => {
            result[config.key] = config.value;
        });

        return result;
    } catch (error) {
        console.error('Error getting all config:', error);
        return DEFAULT_CONFIG;
    }
}

/**
 * Set a configuration value
 */
export async function setConfig(
    key: string,
    value: string,
    category: string,
    type: string,
    updatedBy?: string
): Promise<void> {
    try {
        // Get old value for history
        const oldConfig = await prisma.siteConfig.findUnique({
            where: { key },
        });

        // Update or create config
        await prisma.siteConfig.upsert({
            where: { key },
            update: {
                value,
                category,
                type,
                updatedBy,
            },
            create: {
                key,
                value,
                category,
                type,
                updatedBy,
            },
        });

        // Save to history
        if (updatedBy) {
            await prisma.configHistory.create({
                data: {
                    configKey: key,
                    oldValue: oldConfig?.value || null,
                    newValue: value,
                    changedBy: updatedBy,
                },
            });
        }
    } catch (error) {
        console.error('Error setting config:', error);
        throw error;
    }
}

/**
 * Set multiple configuration values
 */
export async function setMultipleConfig(
    configs: Array<{ key: string; value: string; category: string; type: string }>,
    updatedBy?: string
): Promise<void> {
    try {
        for (const config of configs) {
            await setConfig(config.key, config.value, config.category, config.type, updatedBy);
        }
    } catch (error) {
        console.error('Error setting multiple configs:', error);
        throw error;
    }
}

/**
 * Initialize default configuration
 */
export async function initializeDefaultConfig(): Promise<void> {
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

            console.log('✅ Default configuration initialized');
        }
    } catch (error) {
        console.error('Error initializing default config:', error);
    }
}
