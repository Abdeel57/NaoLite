'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneralConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        site_name: '',
        site_description: '',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        logo_url: '',
        favicon_url: '',
        default_language: 'es',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/config?category=general');
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
                category: 'general',
                type: key.includes('color') ? 'color' : key.includes('url') ? 'image' : 'text',
            }));

            const response = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configs }),
            });

            if (response.ok) {
                alert('✅ Configuración guardada exitosamente');
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
                    <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración General</h1>
                    <p className="text-gray-600 mt-2">Personaliza la información básica de tu plataforma</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Site Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Sitio
                        </label>
                        <input
                            type="text"
                            value={config.site_name}
                            onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="NaoLite"
                            required
                        />
                    </div>

                    {/* Site Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción SEO
                        </label>
                        <textarea
                            value={config.site_description}
                            onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Plataforma de rifas en línea"
                            rows={3}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Esta descripción aparecerá cuando compartas enlaces en redes sociales
                        </p>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Primario
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={config.primary_color}
                                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                    className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.primary_color}
                                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Secundario
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={config.secondary_color}
                                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                    className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={config.secondary_color}
                                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    placeholder="#10B981"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL del Logo
                        </label>
                        <input
                            type="text"
                            value={config.logo_url}
                            onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/logo.png"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Por ahora ingresa la URL del logo. Próximamente: subida de archivos
                        </p>
                    </div>

                    {/* Favicon URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL del Favicon
                        </label>
                        <input
                            type="text"
                            value={config.favicon_url}
                            onChange={(e) => setConfig({ ...config, favicon_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/favicon.ico"
                        />
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Idioma Predeterminado
                        </label>
                        <select
                            value={config.default_language}
                            onChange={(e) => setConfig({ ...config, default_language: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
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
