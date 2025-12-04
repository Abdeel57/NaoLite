"use client"

import { useState, useEffect } from "react"
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
    Filter,
    Loader2,
    Calendar,
    DollarSign,
    ExternalLink,
    Ticket,
    MessageCircle
} from "lucide-react"
import Link from "next/link"

interface User {
    id: string
    name: string
    email: string
    username: string
    plan: string
    role: string
    status: string
    joined: string
    rafflesCount: number
    raffles: Array<{ title: string, id: string, status: string }>
    subscriptionEnd?: string
    lastPaymentDate?: string
    notes?: string
    phone?: string
    whatsapp?: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [updating, setUpdating] = useState<string | null>(null)
    const [debugError, setDebugError] = useState<string>("")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
                setDebugError(`OK (${data.length} users)`)
            } else {
                const text = await response.text()
                setDebugError(`Error ${response.status}: ${text.substring(0, 100)}`)
            }
        } catch (error: any) {
            console.error('Error fetching users:', error)
            setDebugError(`Fetch Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handlePlanChange = async (userId: string, newPlan: string) => {
        setUpdating(userId)
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan })
            })

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, plan: newPlan } : user
                ))
            } else {
                alert('Error al actualizar el plan')
            }
        } catch (error) {
            console.error('Error updating plan:', error)
            alert('Error al actualizar el plan')
        } finally {
            setUpdating(null)
        }
    }

    const handleRegisterPayment = async (userId: string) => {
        if (!confirm('¿Confirmar pago recibido? Esto extenderá la suscripción 30 días.')) return

        setUpdating(userId)
        try {
            const response = await fetch(`/api/admin/users/${userId}/subscription`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'REGISTER_PAYMENT' })
            })

            if (response.ok) {
                const updatedData = await response.json()
                setUsers(users.map(user =>
                    user.id === userId ? {
                        ...user,
                        subscriptionEnd: updatedData.subscriptionEnd,
                        lastPaymentDate: updatedData.lastPaymentDate
                    } : user
                ))
                alert('Pago registrado exitosamente')
            } else {
                alert('Error al registrar pago')
            }
        } catch (error) {
            console.error('Error registering payment:', error)
            alert('Error al registrar pago')
        } finally {
            setUpdating(null)
        }
    }

    const sendWhatsAppReminder = (user: User) => {
        // Use user's whatsapp or phone number
        const userPhone = user.whatsapp || user.phone

        if (!userPhone) {
            alert('Este usuario no tiene número de teléfono registrado')
            return
        }

        // Clean phone number (remove spaces, dashes, etc)
        const cleanPhone = userPhone.replace(/\D/g, '')

        // Ensure it starts with country code (assume Mexico +52 if not present)
        const phone = cleanPhone.startsWith('52') ? cleanPhone : '52' + cleanPhone

        const message = `Hola ${user.name}, recordatorio de que tu plan ${user.plan} en NaoLite está próximo a vencer. Puedes realizar tu pago para continuar disfrutando del servicio. 🚀`
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    const getSubscriptionStatus = (dateString?: string) => {
        if (!dateString) return { label: 'Sin Datos', color: 'bg-gray-100 text-gray-800' }

        const end = new Date(dateString)
        const now = new Date()
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { label: `Vencido (${Math.abs(diffDays)} días)`, color: 'bg-red-100 text-red-800' }
        if (diffDays <= 3) return { label: `Vence en ${diffDays} días`, color: 'bg-yellow-100 text-yellow-800' }
        return { label: 'Al Corriente', color: 'bg-green-100 text-green-800' }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Usuarios (Admin 2.0)</h1>
                    <p className="text-gray-500 mt-1">Control total de suscripciones y pagos.</p>
                </div>
                {/* Buttons temporarily disabled - will implement later */}
            </div>

            <Card>
                <CardHeader className="p-4 border-b bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, correo o ID..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Usuario</th>
                                    <th className="px-6 py-3 font-medium">Rifas Activas</th>
                                    <th className="px-6 py-3 font-medium">Plan</th>
                                    <th className="px-6 py-3 font-medium">Estado Suscripción</th>
                                    <th className="px-6 py-3 font-medium">Vencimiento</th>
                                    <th className="px-6 py-3 font-medium text-right">Acciones Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => {
                                    const status = getSubscriptionStatus(user.subscriptionEnd)
                                    return (
                                        <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                                            {user.name}
                                                            <Link href={`/${user.username}`} target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors" title="Ver Perfil Público">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {user.raffles && user.raffles.length > 0 ? (
                                                        user.raffles.map((raffle, idx) => (
                                                            <Link key={idx} href={`/${user.username}/${raffle.id}`} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                                <Ticket className="w-3 h-3" />
                                                                {raffle.title}
                                                            </Link>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Sin rifas</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    className="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
                                                    value={user.plan}
                                                    onChange={(e) => handlePlanChange(user.id, e.target.value)}
                                                    disabled={updating === user.id}
                                                >
                                                    <option value="FREE">Gratis</option>
                                                    <option value="BASIC">Básico</option>
                                                    <option value="PRO">Pro</option>
                                                    <option value="PREMIUM">Premium</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${status.color} border-none`}>
                                                    {status.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    {user.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => handleRegisterPayment(user.id)}
                                                        disabled={updating === user.id}
                                                        title="Registrar Pago (+30 días)"
                                                    >
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        Pagó
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        onClick={() => sendWhatsAppReminder(user)}
                                                        title="Enviar Recordatorio WhatsApp"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
