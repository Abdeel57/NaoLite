"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
    Plus,
    MoreVertical,
    Ticket,
    Calendar,
    Users,
    PlayCircle,
    PauseCircle,
    Edit
} from "lucide-react"

const raffles = [
    {
        id: "1",
        title: "Gran Sorteo de Fin de Año",
        price: 50,
        sold: 45,
        total: 100,
        status: "active",
        endDate: "31 Dic 2024",
        revenue: 2250
    },
    {
        id: "2",
        title: "Rifa Solidaria",
        price: 20,
        sold: 200,
        total: 200,
        status: "completed",
        endDate: "30 Nov 2024",
        revenue: 4000
    },
    {
        id: "3",
        title: "Borrador: Rifa de Reyes",
        price: 100,
        sold: 0,
        total: 500,
        status: "draft",
        endDate: "-",
        revenue: 0
    }
]

export default function RafflesPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis Rifas</h1>
                    <p className="text-gray-500 mt-1">Crea y administra tus sorteos activos.</p>
                </div>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5" />
                    Crear Nueva Rifa
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {raffles.map((raffle) => (
                    <Card key={raffle.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <Badge
                                    className={`
                    ${raffle.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                    ${raffle.status === 'completed' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                    ${raffle.status === 'draft' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : ''}
                    border-none px-3 py-1
                  `}
                                >
                                    {raffle.status === 'active' && '🟢 Activa'}
                                    {raffle.status === 'completed' && '🏁 Finalizada'}
                                    {raffle.status === 'draft' && '📝 Borrador'}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </Button>
                            </div>
                            <CardTitle className="mt-4 text-xl line-clamp-1 group-hover:text-primary transition-colors">
                                {raffle.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                                <Calendar className="w-4 h-4" />
                                Finaliza: {raffle.endDate}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Progreso de Venta</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-900">{raffle.sold}</span>
                                            <span className="text-sm text-gray-500">/ {raffle.total} boletos</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Recaudado</p>
                                        <span className="text-lg font-bold text-green-600">${raffle.revenue}</span>
                                    </div>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 rounded-full"
                                        style={{ width: `${(raffle.sold / raffle.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4 border-t bg-gray-50/50 flex gap-2">
                            <Button variant="outline" className="flex-1 gap-2 hover:border-primary hover:text-primary">
                                <Edit className="w-4 h-4" />
                                Editar
                            </Button>
                            <Button variant="outline" className="flex-1 gap-2 hover:border-primary hover:text-primary">
                                <Users className="w-4 h-4" />
                                Boletos
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {/* Create New Card Placeholder */}
                <button className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group h-full min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">Crear Nueva Rifa</h3>
                        <p className="text-sm text-gray-500 mt-1">Configura un nuevo sorteo</p>
                    </div>
                </button>
            </div>
        </div>
    )
}
