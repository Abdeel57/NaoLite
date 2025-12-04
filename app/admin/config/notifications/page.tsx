'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotificationsConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        notification_email_host: '',
        notification_email_port: '587',
        notification_email_user: '',
        notification_email_password: '',
        notification_email_from: '',
        notification_whatsapp_number: '',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/config?category=notifications');
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
                category: 'notifications',
                type: key.includes('password') ? 'password' : 'text',
            }));

            const response = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configs }),
            });

            if (response.ok) {
                alert('✅ Configuración de notificaciones guardada exitosamente');
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
                    <h1 className="text-3xl font-bold text-gray-900">🔔 Configuración de Notificaciones</h1>
                    <p className="text-gray-600 mt-2">Configura cómo se enviarán las notificaciones a los usuarios</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Email SMTP Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📧</span>
                            Servidor SMTP (Email)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Host SMTP
                                </label>
                                <input
                                    type="text"
                                    value={config.notification_email_host}
                                    onChange={(e) => setConfig({ ...config, notification_email_host: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="smtp.gmail.com"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Servidor SMTP de tu proveedor de email
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Puerto SMTP
                                </label>
                                <input
                                    type="number"
                                    value={config.notification_email_port}
                                    onChange={(e) => setConfig({ ...config, notification_email_port: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="587"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Usualmente 587 (TLS) o 465 (SSL)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Usuario SMTP
                                </label>
                                <input
                                    type="email"
                                    value={config.notification_email_user}
                                    onChange={(e) => setConfig({ ...config, notification_email_user: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="tu-email@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña SMTP
                                </label>
                                <input
                                    type="password"
                                    value={config.notification_email_password}
                                    onChange={(e) => setConfig({ ...config, notification_email_password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Para Gmail, usa una "Contraseña de aplicación"
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Remitente
                                </label>
                                <input
                                    type="email"
                                    value={config.notification_email_from}
                                    onChange={(e) => setConfig({ ...config, notification_email_from: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="noreply@naolite.com"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Dirección que aparecerá como remitente en los emails
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💬</span>
                            WhatsApp
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de WhatsApp Principal
                            </label>
                            <input
                                type="tel"
                                value={config.notification_whatsapp_number}
                                onChange={(e) => setConfig({ ...config, notification_whatsapp_number: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+52 555 123 4567"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Número para enviar notificaciones y recordatorios
                            </p>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-bold text-blue-900 mb-2">ℹ️ Información Importante</h3>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Las notificaciones por email requieren un servidor SMTP configurado</li>
                            <li>Para Gmail, habilita la verificación en 2 pasos y genera una contraseña de aplicación</li>
                            <li>Las notificaciones de WhatsApp requieren integración con WhatsApp Business API</li>
                            <li>Próximamente: Plantillas personalizables de emails y mensajes</li>
                        </ul>
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
