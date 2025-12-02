"use client"

import { useState } from "react"
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
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Información Básica</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Organización</label>
                    <Input placeholder="Club Deportivo Demo" defaultValue="Club Deportivo Demo" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biografía / Descripción</label>
                    <Textarea placeholder="Describe tu organización..." rows={4} defaultValue="Organizamos rifas para apoyar el deporte local." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                    <Input type="email" placeholder="contacto@ejemplo.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
                    <Input type="tel" placeholder="+52 123 456 7890" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Redes Sociales</h3>
                <div className="space-y-3">
                    <Input placeholder="Facebook URL" />
                    <Input placeholder="Instagram URL" />
                    <Input placeholder="Twitter URL" />
                </div>
            </div>

            <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
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
    const reservations = [
        { id: "APT-001", raffle: "iPhone 15 Pro", ticket: "0042", user: "Juan Pérez", status: "pending" },
        { id: "APT-002", raffle: "PlayStation 5", ticket: "0156", user: "María García", status: "pending" },
    ]

    return (
        <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">Boletos apartados pendientes de confirmación de pago.</p>
            {reservations.map((res) => (
                <div key={res.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-medium text-gray-900">{res.raffle}</p>
                            <p className="text-sm text-gray-500">Boleto #{res.ticket}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{res.user}</p>
                    <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Confirmar Pago</Button>
                        <Button size="sm" variant="outline" className="flex-1">Cancelar</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Sales Content
function SalesContent() {
    const sales = [
        { id: "VNT-045", raffle: "iPhone 15 Pro", ticket: "0123", amount: 250, date: "28 Nov 2024" },
        { id: "VNT-044", raffle: "PlayStation 5", ticket: "0089", amount: 150, date: "27 Nov 2024" },
    ]

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600">Ventas Totales</p>
                    <p className="text-2xl font-bold text-green-900">$12,450</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600">Este Mes</p>
                    <p className="text-2xl font-bold text-blue-900">$3,200</p>
                </div>
            </div>

            <h3 className="font-semibold text-gray-900">Ventas Recientes</h3>
            {sales.map((sale) => (
                <div key={sale.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900">{sale.raffle}</p>
                            <p className="text-sm text-gray-500">Boleto #{sale.ticket}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-green-600">${sale.amount}</p>
                            <p className="text-xs text-gray-500">{sale.date}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Raffles Content
function RafflesContent() {
    const raffles = [
        { id: 1, title: "iPhone 15 Pro", status: "active", sold: 45, total: 100 },
        { id: 2, title: "PlayStation 5", status: "active", sold: 78, total: 150 },
    ]

    return (
        <div className="p-6 space-y-4">
            <Button className="w-full mb-4">+ Crear Nueva Rifa</Button>
            {raffles.map((raffle) => (
                <div key={raffle.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="font-medium text-gray-900">{raffle.title}</p>
                            <Badge className="bg-green-100 text-green-800 mt-1">Activa</Badge>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium">{raffle.sold}/{raffle.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${(raffle.sold / raffle.total) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">Editar</Button>
                        <Button size="sm" variant="outline" className="flex-1">Ver Boletos</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

// User Content
function UserContent() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Plan Actual</h3>
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-gray-900">Plan Pro</p>
                            <p className="text-sm text-gray-600">$399/mes</p>
                        </div>
                        <Button size="sm">Mejorar Plan</Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Seguridad</h3>
                <Button variant="outline" className="w-full justify-start">
                    Cambiar Contraseña
                </Button>
            </div>

            <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}
