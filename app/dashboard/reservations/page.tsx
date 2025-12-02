"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    MessageCircle
} from "lucide-react"

const reservations = [
    {
        id: "RES-001",
        customer: "María González",
        phone: "6621234567",
        tickets: ["045", "128"],
        raffle: "Gran Sorteo Fin de Año",
        amount: 100,
        status: "pending",
        expiresIn: "2 horas"
    },
    {
        id: "RES-002",
        customer: "Pedro Sánchez",
        phone: "6629876543",
        tickets: ["099"],
        raffle: "Rifa Solidaria",
        amount: 20,
        status: "expired",
        expiresIn: "-"
    },
    {
        id: "RES-003",
        customer: "Ana López",
        phone: "6625558888",
        tickets: ["012", "013", "014"],
        raffle: "Gran Sorteo Fin de Año",
        amount: 150,
        status: "pending",
        expiresIn: "45 min"
    }
]

export default function ReservationsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Apartados</h1>
                    <p className="text-gray-500 mt-1">Gestiona los boletos apartados pendientes de pago.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </Button>
                    <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Clock className="w-4 h-4" />
                        Limpiar Vencidos
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="p-4 border-b bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, teléfono o boleto..."
                            className="pl-9 bg-white max-w-md"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Cliente</th>
                                    <th className="px-6 py-3 font-medium">Rifa</th>
                                    <th className="px-6 py-3 font-medium">Boletos</th>
                                    <th className="px-6 py-3 font-medium">Total</th>
                                    <th className="px-6 py-3 font-medium">Estado</th>
                                    <th className="px-6 py-3 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{res.customer}</div>
                                            <div className="text-xs text-gray-500">{res.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {res.raffle}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-[150px]">
                                                {res.tickets.map(t => (
                                                    <Badge key={t} variant="secondary" className="text-xs font-mono">
                                                        {t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ${res.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            {res.status === 'pending' ? (
                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Expira en {res.expiresIn}
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Vencido
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" title="Confirmar Pago">
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Enviar WhatsApp">
                                                    <MessageCircle className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" title="Cancelar">
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
