import { NextRequest, NextResponse } from 'next/server';
import { getAllConfig, getConfigByCategory, setMultipleConfig } from '@/lib/config';

// GET /api/admin/config - Get all configurations or by category
export async function GET(request: NextRequest) {
    try {
        // TODO: Add proper authentication
        // For now, skip auth check since we're using localStorage-based auth

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let config;
        if (category) {
            config = await getConfigByCategory(category);
        } else {
            config = await getAllConfig();
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/config - Update configurations
export async function PUT(request: NextRequest) {
    try {
        // TODO: Add proper authentication
        // For now, skip auth check since we're using localStorage-based auth

        const body = await request.json();
        const { configs } = body;

        if (!Array.isArray(configs)) {
            return NextResponse.json(
                { error: 'Invalid request format' },
                { status: 400 }
            );
        }

        await setMultipleConfig(configs, 'admin');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating config:', error);
        return NextResponse.json(
            { error: 'Failed to update configuration' },
            { status: 500 }
        );
    }
}
