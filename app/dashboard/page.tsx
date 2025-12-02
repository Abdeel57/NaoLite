"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
    TrendingUp,
    Ticket,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Resumen</h1>
                <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí está lo que está pasando con tus rifas.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Ingresos Totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">$12,450</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +15% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Boletos Vendidos
                        </CardTitle>
                        <Ticket className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">245</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            +8% vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Rifas Activas
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">2</div>
                        <p className="text-xs text-gray-500 mt-1">
                            1 finaliza pronto
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Visitas al Perfil
                        </CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">1,203</div>
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                            -3% vs mes anterior
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Ventas Recientes</h2>
                    <Card className="shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {["JP", "AM", "CR", "Lu", "Ma"][i - 1]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {["Juan Pérez", "Ana Martínez", "Carlos Ruiz", "Lucía Méndez", "Mario López"][i - 1]}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Compró {i * 2} boletos • Gran Sorteo Fin de Año
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">+${i * 100}</p>
                                            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                <Clock className="w-3 h-3" />
                                                Hace {i * 15} min
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions or Notifications */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Acciones Rápidas</h2>
                    <div className="grid gap-3">
                        <button className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all text-left group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Ticket className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-900">Crear Nueva Rifa</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-[52px]">Configura un nuevo sorteo en minutos</p>
                        </button>

                        <button className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-secondary transition-all text-left group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-secondary/10 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-900">Ver Participantes</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-[52px]">Gestiona tu base de datos de clientes</p>
                        </button>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
                        <Card className="bg-gradient-to-br from-primary to-secondary text-white border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">Cierre de Rifa</p>
                                        <h3 className="text-xl font-bold mt-1">Gran Sorteo</h3>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/80">Tiempo restante</span>
                                        <span className="font-bold">2 días</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/90 w-[85%] rounded-full" />
                                    </div>
                                    <p className="text-xs text-white/70 text-right">85% Vendido</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
