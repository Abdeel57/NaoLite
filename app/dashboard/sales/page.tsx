"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import {
    Search,
    Download,
    Calendar,
    DollarSign,
    Ticket
} from "lucide-react"

const sales = [
    {
        id: "SALE-001",
        date: "28 Nov 2024",
        customer: "Juan Pérez",
        raffle: "Gran Sorteo Fin de Año",
        tickets: ["001", "002"],
        amount: 100,
        method: "Transferencia"
    },
    {
        id: "SALE-002",
        date: "27 Nov 2024",
        customer: "Ana Martínez",
        raffle: "Rifa Solidaria",
        tickets: ["150"],
        amount: 20,
        method: "Efectivo"
    },
    {
        id: "SALE-003",
        date: "27 Nov 2024",
        customer: "Carlos Ruiz",
        raffle: "Gran Sorteo Fin de Año",
        tickets: ["088", "089", "090"],
        amount: 150,
        method: "Transferencia"
    },
    {
        id: "SALE-004",
        date: "26 Nov 2024",
        customer: "Lucía Méndez",
        raffle: "Gran Sorteo Fin de Año",
        tickets: ["050"],
        amount: 50,
        method: "Depósito OXXO"
    }
]

export default function SalesPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ventas</h1>
                    <p className="text-gray-500 mt-1">Historial completo de boletos vendidos y pagados.</p>
                </div>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4" />
                    Exportar Excel
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                            <h3 className="text-2xl font-bold text-gray-900">$12,450</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Boletos Vendidos</p>
                            <h3 className="text-2xl font-bold text-gray-900">245</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Este Mes</p>
                            <h3 className="text-2xl font-bold text-gray-900">+15%</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="p-4 border-b bg-gray-50/50">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar venta..."
                                className="pl-9 bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Input type="date" className="w-auto bg-white" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Fecha</th>
                                    <th className="px-6 py-3 font-medium">Cliente</th>
                                    <th className="px-6 py-3 font-medium">Rifa</th>
                                    <th className="px-6 py-3 font-medium">Boletos</th>
                                    <th className="px-6 py-3 font-medium">Método</th>
                                    <th className="px-6 py-3 font-medium text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sales.map((sale) => (
                                    <tr key={sale.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                            {sale.date}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {sale.customer}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {sale.raffle}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 flex-wrap max-w-[150px]">
                                                {sale.tickets.map(t => (
                                                    <Badge key={t} variant="outline" className="text-xs font-mono border-gray-300 text-gray-700">
                                                        {t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <Badge variant="secondary" className="font-normal">
                                                {sale.method}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-right">
                                            ${sale.amount}
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
