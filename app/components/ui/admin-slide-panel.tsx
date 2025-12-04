"use client"

import { useState, useEffect } from "react"
import { X, Palette, Calendar, TrendingUp, Ticket, User, Save, Upload, Mail, Phone, Facebook, Instagram, Twitter, MessageCircle, Share2, Copy, Check } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Badge } from "./badge"

interface AdminSlidePanelProps {
    isOpen: boolean
    onClose: () => void
}

type TabType = "customize" | "reservations" | "sales" | "raffles" | "user" | "share"

export function AdminSlidePanel({ isOpen, onClose }: AdminSlidePanelProps) {
    const [activeTab, setActiveTab] = useState<TabType | null>(null)

    const tabs = [
        { id: "customize" as TabType, label: "Personalizar", icon: Palette },
        { id: "share" as TabType, label: "Compartir", icon: Share2 },
        { id: "reservations" as TabType, label: "Apartados", icon: Calendar },
        { id: "sales" as TabType, label: "Ventas", icon: TrendingUp },
        { id: "raffles" as TabType, label: "Rifas", icon: Ticket },
        { id: "user" as TabType, label: "Usuario", icon: User },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "customize":
                return <CustomizeContent />
            case "share":
                return <ShareContent />
            case "reservations":
                return <ReservationsContent />
            case "sales":
                return <SalesContent />
            case "raffles":
                return <RafflesContent />
            case "user":
                return <UserContent />
            default:
                return <HomeContent onSelectTab={setActiveTab} tabs={tabs} />
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Slide Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    {activeTab && (
                        <button
                            onClick={() => setActiveTab(null)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Volver
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-gray-900">
                        {activeTab ? tabs.find(t => t.id === activeTab)?.label : "Administrador"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-64px)] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </>
    )
}

// Home Content (Grid of options)
function HomeContent({ onSelectTab, tabs }: { onSelectTab: (tab: TabType) => void, tabs: any[] }) {
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onSelectTab(tab.id)}
                            className="group aspect-square flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer border border-gray-100 hover:border-primary"
                        >
                            <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                            <span className="font-semibold text-xs text-gray-900 group-hover:text-white text-center">
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// Customize Content
function CustomizeContent() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        email: '',
        phone: '',
        facebook: '',
        instagram: '',
        twitter: '',
        whatsapp: ''
    })

    // Cargar datos del usuario
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = localStorage.getItem('currentUser')
                if (!currentUser) {
                    setMessage({ type: 'error', text: 'No hay sesión activa' })
                    setLoading(false)
                    return
                }

                const user = JSON.parse(currentUser)
                const response = await fetch(`/api/user/profile?username=${user.username}`)
                
                if (response.ok) {
                    const data = await response.json()
                    setFormData({
                        name: data.name || '',
                        bio: data.bio || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        facebook: data.facebook || '',
                        instagram: data.instagram || '',
                        twitter: data.twitter || '',
                        whatsapp: data.whatsapp || ''
                    })
                } else {
                    setMessage({ type: 'error', text: 'Error al cargar perfil' })
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Error de conexión' })
            } finally {
                setLoading(false)
            }
        }

        loadUserData()
    }, [])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setMessage(null)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) {
                setMessage({ type: 'error', text: 'No hay sesión activa' })
                setSaving(false)
                return
            }

            const user = JSON.parse(currentUser)
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    ...formData
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
                
                // Actualizar localStorage con los nuevos datos
                const updatedUser = { ...user, ...data.user }
                localStorage.setItem('currentUser', JSON.stringify(updatedUser))
                
                // Limpiar mensaje después de 3 segundos
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al guardar' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {message && (
                <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Información Básica</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Organización</label>
                    <Input 
                        placeholder="Club Deportivo Demo" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biografía / Descripción</label>
                    <Textarea 
                        placeholder="Describe tu organización..." 
                        rows={4} 
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 caracteres</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    <Input 
                        type="email" 
                        placeholder="contacto@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
                    <Input 
                        type="tel" 
                        placeholder="+52 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Redes Sociales</h3>
                <div className="space-y-3">
                    <Input 
                        placeholder="Facebook URL" 
                        value={formData.facebook}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                    />
                    <Input 
                        placeholder="Instagram URL"
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                    />
                    <Input 
                        placeholder="Twitter URL"
                        value={formData.twitter}
                        onChange={(e) => handleChange('twitter', e.target.value)}
                    />
                </div>
            </div>

            <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                    </>
                )}
            </Button>
        </div>
    )
}

// Share Content
function ShareContent() {
    const [copiedProfile, setCopiedProfile] = useState(false)
    const [copiedRaffle, setCopiedRaffle] = useState(false)

    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/demo` : 'https://naolite.com/demo'
    const raffleUrl = typeof window !== 'undefined' ? `${window.location.origin}/demo/raffle-1` : 'https://naolite.com/demo/raffle-1'

    const copyToClipboard = (text: string, type: 'profile' | 'raffle') => {
        navigator.clipboard.writeText(text)
        if (type === 'profile') {
            setCopiedProfile(true)
            setTimeout(() => setCopiedProfile(false), 2000)
        } else {
            setCopiedRaffle(true)
            setTimeout(() => setCopiedRaffle(false), 2000)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Pega estos links en tus historias, estados, descripciones de redes sociales o envíalos por WhatsApp para que más personas participen en tus rifas.
                </p>
            </div>

            {/* Profile Link */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Link de tu Perfil</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Comparte tu perfil completo con todas tus rifas activas
                </p>
                <div className="flex gap-2">
                    <Input
                        value={profileUrl}
                        readOnly
                        className="flex-1 bg-gray-50 text-sm"
                    />
                    <Button
                        size="icon"
                        onClick={() => copyToClipboard(profileUrl, 'profile')}
                        className="flex-shrink-0"
                    >
                        {copiedProfile ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Raffle Link */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Link de Rifa Específica</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Comparte el link directo a una rifa en particular
                </p>
                <div className="flex gap-2">
                    <Input
                        value={raffleUrl}
                        readOnly
                        className="flex-1 bg-gray-50 text-sm"
                    />
                    <Button
                        size="icon"
                        onClick={() => copyToClipboard(raffleUrl, 'raffle')}
                        className="flex-shrink-0"
                    >
                        {copiedRaffle ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-gray-900">¿Dónde compartir?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Instagram/Facebook:</strong> En tu biografía o en historias con stickers de "Desliza hacia arriba"</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>WhatsApp:</strong> Estados o envía el link directamente a tus contactos</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>TikTok:</strong> En la descripción de tus videos</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Email:</strong> Envía el link a tu lista de contactos</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


// Reservations Content
function ReservationsContent() {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        loadReservations()
    }, [])

    const loadReservations = async () => {
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/reservations?username=${user.username}`)
            
            if (response.ok) {
                const data = await response.json()
                setReservations(data)
            }
        } catch (error) {
            console.error('Error loading reservations:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async (ticketId: string) => {
        setUpdating(ticketId)
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/reservations/${ticketId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    action: 'confirm'
                })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Pago confirmado' })
                setTimeout(() => setMessage(null), 2000)
                loadReservations()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Error al confirmar' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setUpdating(null)
        }
    }

    const handleCancel = async (ticketId: string) => {
        if (!confirm('¿Cancelar este apartado?')) return

        setUpdating(ticketId)
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/reservations/${ticketId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    action: 'cancel'
                })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Apartado cancelado' })
                setTimeout(() => setMessage(null), 2000)
                loadReservations()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Error al cancelar' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setUpdating(null)
        }
    }

    const handleCleanExpired = async () => {
        if (!confirm('¿Limpiar todos los apartados vencidos?')) return

        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/reservations/expired?username=${user.username}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                const data = await response.json()
                setMessage({ type: 'success', text: data.message })
                setTimeout(() => setMessage(null), 2000)
                loadReservations()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Error al limpiar' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        }
    }

    const sendWhatsApp = (reservation: any) => {
        const phone = reservation.purchaserPhone?.replace(/\D/g, '')
        if (!phone) {
            alert('No hay teléfono registrado')
            return
        }
        const message = `Hola ${reservation.purchaserName || 'cliente'}, tienes apartado el boleto #${reservation.number} para la rifa "${reservation.raffle.title}". El monto es $${reservation.raffle.price}. ¿Ya realizaste el pago?`
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            {message && (
                <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Boletos apartados pendientes de pago.</p>
                <Button size="sm" variant="outline" onClick={handleCleanExpired}>
                    Limpiar Vencidos
                </Button>
            </div>

            {reservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay apartados pendientes</p>
                </div>
            ) : (
                reservations.map((res) => (
                    <div key={res.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-gray-900">{res.raffle.title}</p>
                                <p className="text-sm text-gray-500">Boleto #{res.number}</p>
                            </div>
                            <Badge className={res.isExpired ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                                {res.isExpired ? 'Vencido' : `${Math.floor(res.minutesLeft / 60)}h ${res.minutesLeft % 60}m`}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{res.purchaserName}</p>
                        <p className="text-xs text-gray-500 mb-3">{res.purchaserPhone}</p>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleConfirm(res.id)}
                                disabled={updating === res.id}
                            >
                                Confirmar Pago
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-shrink-0"
                                onClick={() => sendWhatsApp(res)}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleCancel(res.id)}
                                disabled={updating === res.id}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

// Sales Content
function SalesContent() {
    const [sales, setSales] = useState<any[]>([])
    const [stats, setStats] = useState({ totalSales: 0, totalTickets: 0, monthTotal: 0, monthTickets: 0 })
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        loadSales()
    }, [])

    const loadSales = async () => {
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/sales?username=${user.username}`)
            
            if (response.ok) {
                const data = await response.json()
                setSales(data.sales)
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error loading sales:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async () => {
        setExporting(true)
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/sales/export?username=${user.username}`)
            
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `ventas-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            alert('Error al exportar ventas')
        } finally {
            setExporting(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600">Ventas Totales</p>
                    <p className="text-2xl font-bold text-green-900">${stats.totalSales.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">{stats.totalTickets} boletos</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600">Este Mes</p>
                    <p className="text-2xl font-bold text-blue-900">${stats.monthTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">{stats.monthTickets} boletos</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Ventas Recientes</h3>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleExport}
                    disabled={exporting}
                >
                    {exporting ? 'Exportando...' : 'Exportar CSV'}
                </Button>
            </div>

            {sales.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay ventas aún</p>
                </div>
            ) : (
                sales.slice(0, 10).map((sale) => (
                    <div key={sale.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-900">{sale.raffle.title}</p>
                                <p className="text-sm text-gray-500">Boleto #{sale.number}</p>
                                <p className="text-xs text-gray-600 mt-1">{sale.purchaserName}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">${sale.raffle.price}</p>
                                <p className="text-xs text-gray-500">
                                    {sale.soldAt ? new Date(sale.soldAt).toLocaleDateString('es-MX') : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {sales.length > 10 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                    Mostrando las 10 ventas más recientes. Exporta para ver todas.
                </p>
            )}
        </div>
    )
}

// Raffles Content
function RafflesContent() {
    const [raffles, setRaffles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        totalTickets: '',
        endDate: ''
    })

    useEffect(() => {
        loadRaffles()
    }, [])

    const loadRaffles = async () => {
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/raffles?username=${user.username}`)
            
            if (response.ok) {
                const data = await response.json()
                setRaffles(data)
            }
        } catch (error) {
            console.error('Error loading raffles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        setCreating(true)
        setMessage(null)

        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch('/api/user/raffles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    ...formData,
                    price: parseFloat(formData.price),
                    totalTickets: parseInt(formData.totalTickets)
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Rifa creada correctamente' })
                setShowCreateModal(false)
                setFormData({ title: '', description: '', price: '', totalTickets: '', endDate: '' })
                loadRaffles()
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al crear rifa' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setCreating(false)
        }
    }

    const handleChangeStatus = async (raffleId: string, newStatus: string) => {
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/raffles/${raffleId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    status: newStatus
                })
            })

            if (response.ok) {
                loadRaffles()
                setMessage({ type: 'success', text: 'Estado actualizado' })
                setTimeout(() => setMessage(null), 2000)
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Error al cambiar estado' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        }
    }

    const handleDelete = async (raffleId: string) => {
        if (!confirm('¿Estás seguro de eliminar esta rifa?')) return

        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/raffles/${raffleId}?username=${user.username}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                loadRaffles()
                setMessage({ type: 'success', text: 'Rifa eliminada' })
                setTimeout(() => setMessage(null), 2000)
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Error al eliminar' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string, className: string }> = {
            DRAFT: { label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
            ACTIVE: { label: 'Activa', className: 'bg-green-100 text-green-800' },
            PAUSED: { label: 'Pausada', className: 'bg-yellow-100 text-yellow-800' },
            ENDED: { label: 'Finalizada', className: 'bg-blue-100 text-blue-800' },
            SOLD_OUT: { label: 'Agotada', className: 'bg-purple-100 text-purple-800' }
        }
        return statusMap[status] || statusMap.DRAFT
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            {message && (
                <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <Button className="w-full mb-4" onClick={() => setShowCreateModal(true)}>
                + Crear Nueva Rifa
            </Button>

            {raffles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No tienes rifas aún</p>
                </div>
            ) : (
                raffles.map((raffle) => {
                    const statusInfo = getStatusBadge(raffle.status)
                    return (
                        <div key={raffle.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{raffle.title}</p>
                                    <Badge className={`${statusInfo.className} mt-1`}>{statusInfo.label}</Badge>
                                </div>
                                <select
                                    className="text-xs border rounded px-2 py-1"
                                    value={raffle.status}
                                    onChange={(e) => handleChangeStatus(raffle.id, e.target.value)}
                                >
                                    <option value="DRAFT">Borrador</option>
                                    <option value="ACTIVE">Activa</option>
                                    <option value="PAUSED">Pausada</option>
                                    <option value="ENDED">Finalizada</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progreso</span>
                                    <span className="font-medium">{raffle.soldTickets}/{raffle.totalTickets}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}></div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    ${raffle.price} por boleto
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex-1 text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(raffle.id)}
                                    disabled={raffle.soldTickets > 0}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    )
                })
            )}

            {/* Modal crear rifa */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
                        <h3 className="text-lg font-bold">Crear Nueva Rifa</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ej: iPhone 15 Pro"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe el premio..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Precio</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Boletos</label>
                                <Input
                                    type="number"
                                    value={formData.totalTickets}
                                    onChange={(e) => setFormData(prev => ({ ...prev, totalTickets: e.target.value }))}
                                    placeholder="100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha de cierre</label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowCreateModal(false)}
                                disabled={creating}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleCreate}
                                disabled={creating || !formData.title || !formData.description || !formData.price || !formData.totalTickets || !formData.endDate}
                            >
                                {creating ? 'Creando...' : 'Crear Rifa'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// User Content
function UserContent() {
    const [subscription, setSubscription] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
    const [changingPassword, setChangingPassword] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        loadSubscription()
    }, [])

    const loadSubscription = async () => {
        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch(`/api/user/subscription?username=${user.username}`)
            
            if (response.ok) {
                const data = await response.json()
                setSubscription(data.subscription)
            }
        } catch (error) {
            console.error('Error loading subscription:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
            return
        }

        if (passwordData.new.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
            return
        }

        setChangingPassword(true)
        setMessage(null)

        try {
            const currentUser = localStorage.getItem('currentUser')
            if (!currentUser) return

            const user = JSON.parse(currentUser)
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
                setShowPasswordModal(false)
                setPasswordData({ current: '', new: '', confirm: '' })
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al cambiar contraseña' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setChangingPassword(false)
        }
    }

    const handleLogout = () => {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.removeItem('currentUser')
            window.location.href = '/login'
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {message && (
                <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Plan Actual</h3>
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <p className="font-bold text-lg text-gray-900">Plan {subscription?.planInfo?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-600">${subscription?.planInfo?.price || 0}/mes</p>
                        </div>
                        <Badge className={
                            subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription?.status === 'expiring_soon' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }>
                            {subscription?.status === 'active' ? 'Activo' :
                             subscription?.status === 'expiring_soon' ? 'Por vencer' :
                             'Vencido'}
                        </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>• {subscription?.planInfo?.raffles} rifas activas permitidas</p>
                        <p>• {subscription?.planInfo?.tickets} boletos por rifa</p>
                        {subscription?.daysLeft !== null && (
                            <p className="font-medium">
                                {subscription.daysLeft > 0 
                                    ? `Vence en ${subscription.daysLeft} días` 
                                    : `Vencido hace ${Math.abs(subscription.daysLeft)} días`}
                            </p>
                        )}
                    </div>
                    <Button size="sm" className="w-full mt-3" onClick={() => window.location.href = '/plans'}>
                        Mejorar Plan
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Seguridad</h3>
                <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowPasswordModal(true)}
                >
                    Cambiar Contraseña
                </Button>
            </div>

            <div className="pt-4 border-t">
                <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </div>

            {/* Modal cambiar contraseña */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
                        <h3 className="text-lg font-bold">Cambiar Contraseña</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
                            <Input
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                            <Input
                                type="password"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Confirmar Nueva Contraseña</label>
                            <Input
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowPasswordModal(false)
                                    setPasswordData({ current: '', new: '', confirm: '' })
                                    setMessage(null)
                                }}
                                disabled={changingPassword}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleChangePassword}
                                disabled={changingPassword || !passwordData.current || !passwordData.new || !passwordData.confirm}
                            >
                                {changingPassword ? 'Cambiando...' : 'Cambiar'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
