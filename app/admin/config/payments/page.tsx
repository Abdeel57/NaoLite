'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        payment_whatsapp_number: '',
        payment_bank_name: '',
        payment_bank_account: '',
        payment_bank_clabe: '',
        payment_bank_holder: '',
        payment_platform_commission: '5',
        payment_currency: 'MXN',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/config?category=payments');
            if (response.ok) {
                const data = await response.json();
                setConfig(prev => ({ ...prev, ...data }));
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
            const configs = Object.entries(config).map(([key, value]) => ({
                key,
                value: String(value),
                category: 'payments',
                type: 'text',
            }));

            const response = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configs }),
            });

            if (response.ok) {
                alert('✅ Configuración de pagos guardada exitosamente');
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                    >
                        ← Volver al Admin
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">💳 Configuración de Pagos</h1>
                    <p className="text-gray-600 mt-2">Configura los métodos de pago para recibir suscripciones</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    {/* WhatsApp Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💬</span>
                            WhatsApp
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de WhatsApp para Pagos
                            </label>
                            <input
                                type="tel"
                                value={config.payment_whatsapp_number}
                                onChange={(e) => setConfig({ ...config, payment_whatsapp_number: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+52 555 123 4567"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Los usuarios te enviarán comprobantes de pago a este número
                            </p>
                        </div>
                    </div>

                    {/* Bank Transfer Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🏦</span>
                            Transferencia Bancaria
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Banco
                                </label>
                                <input
                                    type="text"
                                    value={config.payment_bank_name}
                                    onChange={(e) => setConfig({ ...config, payment_bank_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="BBVA, Santander, Banorte, etc."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titular de la Cuenta
                                </label>
                                <input
                                    type="text"
                                    value={config.payment_bank_holder}
                                    onChange={(e) => setConfig({ ...config, payment_bank_holder: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nombre completo del titular"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Cuenta
                                </label>
                                <input
                                    type="text"
                                    value={config.payment_bank_account}
                                    onChange={(e) => setConfig({ ...config, payment_bank_account: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    placeholder="1234567890"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CLABE Interbancaria
                                </label>
                                <input
                                    type="text"
                                    value={config.payment_bank_clabe}
                                    onChange={(e) => setConfig({ ...config, payment_bank_clabe: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    placeholder="012345678901234567"
                                    maxLength={18}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    18 dígitos para transferencias SPEI
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Settings */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>⚙️</span>
                            Configuración de la Plataforma
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comisión de la Plataforma (%)
                                </label>
                                <input
                                    type="number"
                                    value={config.payment_platform_commission}
                                    onChange={(e) => setConfig({ ...config, payment_platform_commission: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Porcentaje que cobra NaoLite por cada venta de ticket
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Moneda Predeterminada
                                </label>
                                <select
                                    value={config.payment_currency}
                                    onChange={(e) => setConfig({ ...config, payment_currency: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                    <option value="USD">USD - Dólar Estadounidense</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
                        <h3 className="text-lg font-bold mb-3 text-blue-900">📋 Vista Previa de Datos Bancarios</h3>
                        <p className="text-sm text-blue-700 mb-4">Así verán los usuarios tu información de pago:</p>

                        <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Banco:</span>
                                <span className="text-gray-900">{config.payment_bank_name || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Titular:</span>
                                <span className="text-gray-900">{config.payment_bank_holder || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Cuenta:</span>
                                <span className="text-gray-900 font-mono">{config.payment_bank_account || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">CLABE:</span>
                                <span className="text-gray-900 font-mono">{config.payment_bank_clabe || '---'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span className="font-medium text-gray-700">WhatsApp:</span>
                                <span className="text-green-600 font-medium">{config.payment_whatsapp_number || '---'}</span>
                            </div>
                        </div>
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
