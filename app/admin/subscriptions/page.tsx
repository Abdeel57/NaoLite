"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
    Download,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react"

const transactions = [
    {
        id: "TRX-9821",
        user: "Club Deportivo Demo",
        plan: "Pro Monthly",
        amount: 399,
        status: "paid",
        date: "28 Nov 2024",
        method: "Visa •••• 4242"
    },
    {
        id: "TRX-9820",
        user: "Fundación Esperanza",
        plan: "Premium Yearly",
        amount: 7990,
        status: "paid",
        date: "27 Nov 2024",
        method: "Mastercard •••• 8888"
    },
    {
        id: "TRX-9819",
        user: "Rifas Express",
        plan: "Basic Monthly",
        amount: 250,
        status: "failed",
        date: "26 Nov 2024",
        method: "Visa •••• 1234"
    },
    {
        id: "TRX-9818",
        user: "Escuela Primaria Benito Juárez",
        plan: "Pro Monthly",
        amount: 399,
        status: "pending",
        date: "25 Nov 2024",
        method: "Transferencia"
    }
]

export default function AdminSubscriptionsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Suscripciones y Pagos</h1>
                    <p className="text-gray-500 mt-1">Historial de transacciones y estado de suscripciones.</p>
                </div>
                {/* Export functionality will be implemented later */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500">Ingresos este mes</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-2">$45,200</h3>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">75% de la meta mensual</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500">Pagos Fallidos</p>
                        <h3 className="text-2xl font-bold text-red-600 mt-2">12</h3>
                        <p className="text-xs text-gray-500 mt-2">Requieren atención inmediata</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500">Próximas Renovaciones</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-2">158</h3>
                        <p className="text-xs text-gray-500 mt-2">En los próximos 7 días</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="p-4 border-b bg-gray-50/50">
                    <CardTitle className="text-base font-medium text-gray-900">Transacciones Recientes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">ID Transacción</th>
                                    <th className="px-6 py-3 font-medium">Usuario</th>
                                    <th className="px-6 py-3 font-medium">Plan</th>
                                    <th className="px-6 py-3 font-medium">Monto</th>
                                    <th className="px-6 py-3 font-medium">Estado</th>
                                    <th className="px-6 py-3 font-medium">Fecha</th>
                                    <th className="px-6 py-3 font-medium">Método</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            {trx.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {trx.user}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {trx.plan}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ${trx.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            {trx.status === 'paid' && (
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Pagado
                                                </Badge>
                                            )}
                                            {trx.status === 'failed' && (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                                                    <XCircle className="w-3 h-3 mr-1" /> Fallido
                                                </Badge>
                                            )}
                                            {trx.status === 'pending' && (
                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
                                                    <Clock className="w-3 h-3 mr-1" /> Pendiente
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {trx.date}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                            <CreditCard className="w-3 h-3" />
                                            {trx.method}
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
