'use client';

import { useRouter } from 'next/navigation';

export default function ConfigPage() {
    const router = useRouter();

    const configSections = [
        {
            id: 'general',
            title: 'Configuración General',
            description: 'Nombre del sitio, logo, colores y configuración básica',
            icon: '⚙️',
            color: 'from-blue-500 to-blue-600',
            path: '/admin/config/general',
        },
        {
            id: 'plans',
            title: 'Planes y Precios',
            description: 'Gestiona los planes FREE, BASIC, PRO y PREMIUM',
            icon: '💎',
            color: 'from-purple-500 to-purple-600',
            path: '/admin/config/plans',
        },
        {
            id: 'payments',
            title: 'Métodos de Pago',
            description: 'Configura WhatsApp y datos bancarios para transferencias',
            icon: '💳',
            color: 'from-green-500 to-green-600',
            path: '/admin/config/payments',
        },
        {
            id: 'notifications',
            title: 'Notificaciones',
            description: 'Configura SMTP para emails y WhatsApp para mensajes',
            icon: '🔔',
            color: 'from-orange-500 to-orange-600',
            path: '/admin/config/notifications',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                    >
                        ← Volver al Admin
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">⚙️ Configuración del Sistema</h1>
                    <p className="text-gray-600 text-lg">
                        Personaliza y configura todos los aspectos de tu plataforma NaoLite
                    </p>
                </div>

                {/* Configuration Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {configSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => router.push(section.path)}
                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                        >
                            {/* Gradient Header */}
                            <div className={`bg-gradient-to-r ${section.color} p-6 text-white`}>
                                <div className="text-5xl mb-3">{section.icon}</div>
                                <h2 className="text-2xl font-bold">{section.title}</h2>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">{section.description}</p>
                                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                                    Configurar
                                    <svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                        <span>💡</span>
                        Consejos de Configuración
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Completa primero la <strong>Configuración General</strong> para personalizar tu marca</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Ajusta los <strong>Planes y Precios</strong> según tu modelo de negocio</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Configura tus <strong>Métodos de Pago</strong> para empezar a recibir suscripciones</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Las <strong>Notificaciones</strong> son opcionales pero mejoran la comunicación con usuarios</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
