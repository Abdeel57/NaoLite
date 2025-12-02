"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import {
    Search,
    MoreVertical,
    UserCheck,
    UserX,
    Shield,
    Mail,
    Filter
} from "lucide-react"

const users = [
    {
        id: "USR-001",
        name: "Club Deportivo Demo",
        email: "contacto@clubdeportivo.com",
        plan: "Pro",
        status: "active",
        joined: "15 Nov 2024",
        raffles: 3
    },
    {
        id: "USR-002",
        name: "Fundación Esperanza",
        email: "admin@fundacion.org",
        plan: "Premium",
        status: "active",
        joined: "10 Nov 2024",
        raffles: 12
    },
    {
        id: "USR-003",
        name: "Rifas Express",
        email: "juan@rifasexpress.mx",
        plan: "Basic",
        status: "suspended",
        joined: "01 Nov 2024",
        raffles: 1
    },
    {
        id: "USR-004",
        name: "Escuela Primaria Benito Juárez",
        email: "director@escuela.edu.mx",
        plan: "Pro",
        status: "active",
        joined: "20 Nov 2024",
        raffles: 2
    }
]

export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-500 mt-1">Administra a los organizadores registrados en la plataforma.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </Button>
                    <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                        <Mail className="w-4 h-4" />
                        Enviar Comunicado
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="p-4 border-b bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, correo o ID..."
                            className="pl-9 bg-white"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Organización / Usuario</th>
                                    <th className="px-6 py-3 font-medium">Plan Actual</th>
                                    <th className="px-6 py-3 font-medium">Estado</th>
                                    <th className="px-6 py-3 font-medium">Rifas</th>
                                    <th className="px-6 py-3 font-medium">Registro</th>
                                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="border-slate-200 text-slate-700">
                                                {user.plan}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === 'active' ? (
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
                                                    Suspendido
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.raffles}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <Shield className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                    <MoreVertical className="w-4 h-4" />
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
