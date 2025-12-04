'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PlanConfig {
    price_monthly: string;
    price_yearly: string;
    max_raffles: string;
    max_tickets: string;
    commission: string;
    trial_days: string;
}

export default function PlansConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [plans, setPlans] = useState({
        free: {
            price_monthly: '0',
            price_yearly: '0',
            max_raffles: '3',
            max_tickets: '100',
            commission: '10',
            trial_days: '0',
        },
        basic: {
            price_monthly: '299',
            price_yearly: '2990',
            max_raffles: '10',
            max_tickets: '500',
            commission: '8',
            trial_days: '7',
        },
        pro: {
            price_monthly: '599',
            price_yearly: '5990',
            max_raffles: '50',
            max_tickets: '2000',
            commission: '5',
            trial_days: '14',
        },
        premium: {
            price_monthly: '999',
            price_yearly: '9990',
            max_raffles: 'unlimited',
            max_tickets: 'unlimited',
            commission: '3',
            trial_days: '30',
        },
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/config?category=plans');
            if (response.ok) {
                const data = await response.json();

                // Parse the data into plan structure
                const parsedPlans: any = { free: {}, basic: {}, pro: {}, premium: {} };
                Object.entries(data).forEach(([key, value]) => {
                    const match = key.match(/^plan_(\w+)_(.+)$/);
                    if (match) {
                        const [, planName, field] = match;
                        if (parsedPlans[planName]) {
                            parsedPlans[planName][field] = value;
                        }
                    }
                });

                setPlans(prev => ({
                    free: { ...prev.free, ...parsedPlans.free },
                    basic: { ...prev.basic, ...parsedPlans.basic },
                    pro: { ...prev.pro, ...parsedPlans.pro },
                    premium: { ...prev.premium, ...parsedPlans.premium },
                }));
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const configs: any[] = [];

            Object.entries(plans).forEach(([planName, planData]) => {
                Object.entries(planData).forEach(([field, value]) => {
                    configs.push({
                        key: `plan_${planName}_${field}`,
                        value: String(value),
                        category: 'plans',
                        type: 'text',
                    });
                });
            });

            const response = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configs }),
            });

            if (response.ok) {
                alert('✅ Configuración de planes guardada exitosamente');
            } else {
                alert('❌ Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            alert('❌ Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const updatePlan = (planName: keyof typeof plans, field: keyof PlanConfig, value: string) => {
        setPlans(prev => ({
            ...prev,
            [planName]: {
                ...prev[planName],
                [field]: value,
            },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    const renderPlanCard = (planName: keyof typeof plans, title: string, icon: string, color: string) => {
        const plan = plans[planName];

        return (
            <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${color}`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>{icon}</span>
                    {title}
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Mensual (MXN)
                            </label>
                            <input
                                type="number"
                                value={plan.price_monthly}
                                onChange={(e) => updatePlan(planName, 'price_monthly', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={planName === 'free'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Anual (MXN)
                            </label>
                            <input
                                type="number"
                                value={plan.price_yearly}
                                onChange={(e) => updatePlan(planName, 'price_yearly', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={planName === 'free'}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Máximo de Rifas Activas
                        </label>
                        <input
                            type="text"
                            value={plan.max_raffles}
                            onChange={(e) => updatePlan(planName, 'max_raffles', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="unlimited o número"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Máximo de Tickets por Rifa
                        </label>
                        <input
                            type="text"
                            value={plan.max_tickets}
                            onChange={(e) => updatePlan(planName, 'max_tickets', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="unlimited o número"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comisión por Venta (%)
                        </label>
                        <input
                            type="number"
                            value={plan.commission}
                            onChange={(e) => updatePlan(planName, 'commission', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Días de Prueba Gratuita
                        </label>
                        <input
                            type="number"
                            value={plan.trial_days}
                            onChange={(e) => updatePlan(planName, 'trial_days', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            disabled={planName === 'free'}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                    >
                        ← Volver al Admin
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">💎 Configuración de Planes</h1>
                    <p className="text-gray-600 mt-2">Define los precios y características de cada plan de suscripción</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderPlanCard('free', 'Plan FREE', '🆓', 'border-gray-400')}
                        {renderPlanCard('basic', 'Plan BASIC', '⭐', 'border-blue-400')}
                        {renderPlanCard('pro', 'Plan PRO', '🚀', 'border-purple-400')}
                        {renderPlanCard('premium', 'Plan PREMIUM', '👑', 'border-yellow-400')}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
