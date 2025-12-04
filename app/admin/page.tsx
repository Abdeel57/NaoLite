"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
    Users,
    CreditCard,
    Activity,
    ArrowUpRight,
    DollarSign,
    ShieldCheck,
    Loader2
} from "lucide-react"

interface Stats {
    mrr: {
        value: number
        growth: number
        formatted: string
    }
    totalUsers: {
        value: number
        newThisMonth: number
    }
    activeSubscriptions: {
        value: number
        conversionRate: number
    }
    activeRaffles: {
        value: number
    }
    recentUsers: Array<{
        id: string
        name: string
        email: string
        plan: string
        joinedAgo: string
    }>
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            } else {
                setError('Error al cargar estadísticas')
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="text-center text-red-600 p-8">
                {error || 'Error al cargar datos'}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resumen Global</h1>
                <p className="text-gray-500 mt-1">Visión general del rendimiento de la plataforma NaoLite.</p>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            MRR (Ingresos Mensuales)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.mrr.formatted}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +{stats.mrr.growth}% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Usuarios Totales
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.value.toLocaleString()}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +{stats.totalUsers.newThisMonth} nuevos este mes
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Suscripciones Activas
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions.value}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Tasa de conversión: {stats.activeSubscriptions.conversionRate}%
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Rifas Activas (Global)
                        </CardTitle>
                        <Activity className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.activeRaffles.value}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            En toda la plataforma
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Signups & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Nuevos Usuarios Registrados</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {stats.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Plan: {user.plan}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{user.joinedAgo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estado del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">API Server</p>
                                    <p className="text-xs text-gray-500">Uptime: 99.9%</p>
                                </div>
                            </div>
                            <span className="text-green-600 text-sm font-medium">Operativo</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Base de Datos</p>
                                    <p className="text-xs text-gray-500">Latencia: 24ms</p>
                                </div>
                            </div>
                            <span className="text-green-600 text-sm font-medium">Operativo</span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Alerta de Mantenimiento</h4>
                            <p className="text-xs text-gray-500">
                                Próximo mantenimiento programado para el Domingo a las 03:00 AM UTC. No se espera tiempo de inactividad.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
