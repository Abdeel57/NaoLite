"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { ArrowLeft, Calendar, Ticket, User, Users, ChevronLeft, ChevronRight, Clock, Sparkles, Search, Copy, Check, ShieldCheck } from "lucide-react"
import { CountdownTimer } from "@/app/components/ui/countdown-timer"
import { CreateRaffleCTA } from "@/app/components/ui/create-raffle-cta"

// Mexican States
const MEXICAN_STATES = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
    "Chiapas", "Chihuahua", "Coahuila", "Colima", "Ciudad de México",
    "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
    "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León",
    "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
    "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas"
]

// Mock Data
const RAFFLE_DATA = {
    id: "1",
    organizerName: "Club Deportivo Demo",
    title: "Gran Sorteo de Fin de Año",
    description: "¡Participa para ganar un iPhone 15 Pro Max! El sorteo se realizará en vivo por Instagram.",
    prize: "iPhone 15 Pro Max 256GB",
    images: [
        "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
        "https://images.unsplash.com/photo-1695048133082-1a20484d2569?w=800&q=80"
    ],
    price: 50,
    totalTickets: 100,
    soldTickets: [1, 2, 5, 10, 15, 20, 45, 99],
    endDate: "2025-12-31T20:00:00",
    organizerPhone: "521234567890"
}

// Payment Data (Mock)
const PAYMENT_DATA = {
    bankName: "BBVA",
    accountNumber: "1234567890",
    clabe: "012345678901234567",
    accountHolder: "Juan Pérez Organizador"
}

export default function RaffleDetailPage({ params }: { params: Promise<{ username: string; raffleId: string }> }) {
    const { username, raffleId } = use(params)
    const [selectedTickets, setSelectedTickets] = useState<number[]>([])
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [customerState, setCustomerState] = useState("")
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [showScrollIndicator, setShowScrollIndicator] = useState(true)
    const [checkoutStep, setCheckoutStep] = useState<'selection' | 'customer-form' | 'payment-confirmation'>('selection')
    const [copiedField, setCopiedField] = useState<string | null>(null)

    // Hide scroll indicator after 5 seconds OR when user scrolls to ticket section
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowScrollIndicator(false)
        }, 5000)

        const handleScroll = () => {
            const ticketSection = document.getElementById('ticket-section')
            if (ticketSection) {
                const rect = ticketSection.getBoundingClientRect()
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setShowScrollIndicator(false)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const allTickets = Array.from({ length: RAFFLE_DATA.totalTickets }, (_, i) => i + 1)
    const filteredTickets = allTickets.filter(num =>
        num.toString().includes(searchQuery)
    )

    const handleRandomPick = () => {
        const available = allTickets.filter(num => !RAFFLE_DATA.soldTickets.includes(num) && !selectedTickets.includes(num))
        if (available.length === 0) return

        const randomTicket = available[Math.floor(Math.random() * available.length)]
        toggleTicket(randomTicket)
    }

    const toggleTicket = (number: number) => {
        if (RAFFLE_DATA.soldTickets.includes(number)) return

        setSelectedTickets(prev =>
            prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number]
        )
    }

    const handleWhatsAppRedirect = () => {
        if (selectedTickets.length === 0 || !customerName) return

        const total = selectedTickets.length * RAFFLE_DATA.price
        const ticketString = selectedTickets.sort((a, b) => a - b).join(", ")

        const message = `Hola, quiero enviar mi comprobante de pago para la rifa "${RAFFLE_DATA.title}".
    
📋 *Mis datos:*
Nombre: ${customerName}
Teléfono: ${customerPhone}
Estado: ${customerState}

🎟️ *Boletos apartados:* ${ticketString}
💰 *Total pagado:* $${total}

Adjunto comprobante de transferencia.`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${RAFFLE_DATA.organizerPhone}?text=${encodedMessage}`

        window.open(whatsappUrl, '_blank')
    }

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % RAFFLE_DATA.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + RAFFLE_DATA.images.length) % RAFFLE_DATA.images.length)
    }

    const availableTickets = RAFFLE_DATA.totalTickets - RAFFLE_DATA.soldTickets.length

    return (
        <div className="min-h-screen bg-white pb-6">
            {/* Floating Scroll Indicator - Top Notification */}
            {showScrollIndicator && checkoutStep === 'selection' && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
                    <div className="bg-primary text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white">
                        <span className="text-lg">🎟️</span>
                        <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                            Desliza para ver los boletos
                        </span>
                        <span className="text-lg animate-bounce">👇</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href={`/${username}`} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Link>
                    <span className="font-bold text-lg text-primary">{RAFFLE_DATA.organizerName}</span>
                </div>
            </div>

            {/* Trust Banner - Moved to bottom */}


            {checkoutStep === 'selection' && (
                <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
                    {/* Image Carousel */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 group shadow-md">
                        <div className="relative aspect-square">
                            <Image
                                src={RAFFLE_DATA.images[currentImageIndex]}
                                alt={RAFFLE_DATA.prize}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Navigation */}
                            {RAFFLE_DATA.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-900" />
                                    </button>
                                </>
                            )}

                            {/* Indicators */}
                            {RAFFLE_DATA.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {RAFFLE_DATA.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/60"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timer Section */}
                    <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Clock className="w-5 h-5 text-primary" />
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">El sorteo termina en:</h3>
                        </div>
                        <CountdownTimer endDate={RAFFLE_DATA.endDate} />
                    </div>

                    {/* Raffle Info */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{RAFFLE_DATA.title}</h1>
                        <p className="text-base text-gray-600 mb-4">{RAFFLE_DATA.description}</p>

                        {/* Price & Tickets Minimalist */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 border-b border-gray-100 pb-8 mt-8">
                            <div className="text-center sm:text-left">
                                <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Precio por boleto</div>
                                <div className="text-6xl font-black text-primary tracking-tight">
                                    ${RAFFLE_DATA.price}
                                    <span className="text-xl font-medium text-gray-400 ml-2">MXN</span>
                                </div>
                            </div>

                            <div className="w-full sm:w-auto text-center sm:text-right">
                                <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Disponibilidad</div>
                                <div className="flex items-baseline justify-center sm:justify-end gap-2 mb-3">
                                    <span className="text-4xl font-bold text-gray-900">{availableTickets}</span>
                                    <span className="text-xl text-gray-400 font-medium">/ {RAFFLE_DATA.totalTickets}</span>
                                </div>
                                <div className="w-full sm:w-48 mx-auto sm:mx-0 sm:ml-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${(availableTickets / RAFFLE_DATA.totalTickets) * 100}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    ¡Quedan pocos lugares!
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Selection */}
                    <Card id="ticket-section" className="border-0 shadow-xl bg-white overflow-hidden">
                        {/* New Header Design */}
                        <div className="bg-white border-b p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Ticket className="w-6 h-6 text-primary" />
                                    Selecciona tus Boletos
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Elige tus números de la suerte</p>
                            </div>

                            {/* Stats Badges */}
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                                    <span className="font-medium text-gray-600">{availableTickets} Disponibles</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    <span className="font-bold text-primary">{selectedTickets.length} Seleccionados</span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6 space-y-6">
                            {/* Controls Toolbar */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                                {/* Search */}
                                <div className="relative w-full md:max-w-sm group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Buscar número específico..."
                                        className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-11"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Lucky Button */}
                                <Button
                                    onClick={handleRandomPick}
                                    className="w-full md:w-auto h-11 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-0.5 font-bold px-6 uppercase tracking-wide"
                                >
                                    Maquinita de la Suerte
                                </Button>
                            </div>

                            {/* Tickets Grid Container with Scroll */}
                            <div className="max-h-[50vh] overflow-y-auto overscroll-contain p-1 border-t border-b border-gray-100">
                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 auto-rows-max justify-items-center">
                                    {filteredTickets.map((number) => {
                                        const isSold = RAFFLE_DATA.soldTickets.includes(number)
                                        const isSelected = selectedTickets.includes(number)
                                        const formattedNumber = number.toString().padStart(3, '0')

                                        return (
                                            <button
                                                key={number}
                                                disabled={isSold}
                                                onClick={() => toggleTicket(number)}
                                                className={`
                                                    relative w-full aspect-[1.2/1] flex items-center justify-center rounded-md text-xs sm:text-sm font-bold transition-all border-2
                                                    ${isSold
                                                        ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed decoration-slice"
                                                        : isSelected
                                                            ? "bg-primary border-primary text-white shadow-md scale-105 z-10"
                                                            : "bg-white border-green-500 text-gray-800 hover:bg-green-50"
                                                    }
                                                `}
                                            >
                                                {formattedNumber}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-white" />
                                    <span className="text-xs font-medium text-gray-600 uppercase">Disponible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-primary border-2 border-primary" />
                                    <span className="text-xs font-medium text-gray-600 uppercase">Seleccionado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200" />
                                    <span className="text-xs font-medium text-gray-600 uppercase">Ocupado</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            )}

            {/* Compact Bottom Sheet - Only shows when tickets are selected */}
            {selectedTickets.length > 0 && checkoutStep === 'selection' && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t-4 border-primary shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-5xl mx-auto px-4 py-3">
                        {/* Compact Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 uppercase tracking-wide">Seleccionados</span>
                                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {selectedTickets.length}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Total</div>
                                <div className="text-xl font-black text-white">
                                    ${selectedTickets.length * RAFFLE_DATA.price}
                                </div>
                            </div>
                        </div>

                        {/* Selected Tickets Display - Clickable to deselect */}
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedTickets.sort((a, b) => a - b).map((ticket) => (
                                <button
                                    key={ticket}
                                    onClick={() => toggleTicket(ticket)}
                                    className="bg-primary text-white px-3 py-1 rounded-md text-sm font-bold whitespace-nowrap flex-shrink-0 hover:bg-primary/80 transition-colors cursor-pointer"
                                    title="Click para quitar"
                                >
                                    {String(ticket).padStart(3, '0')}
                                </button>
                            ))}
                        </div>

                        {/* Action Button */}
                        <Button
                            size="lg"
                            className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm"
                            onClick={() => setCheckoutStep('customer-form')}
                        >
                            Apartar
                        </Button>
                    </div>
                </div>
            )}

            {/* Customer Form Modal */}
            {checkoutStep === 'customer-form' && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 relative">
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            {/* Clover decorations */}
                            <div className="absolute top-10 right-10 text-6xl opacity-10 animate-pulse">🍀</div>
                            <div className="absolute bottom-20 left-8 text-5xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>🍀</div>
                            <div className="absolute top-1/2 left-6 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
                            <div className="absolute top-1/3 right-8 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
                            <div className="absolute bottom-1/3 right-12 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}>🎰</div>
                        </div>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-center relative">
                            <button
                                onClick={() => setCheckoutStep('selection')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="text-4xl mb-2">🍀</div>
                            <h2 className="text-2xl font-bold text-white">Tus Datos</h2>
                            <p className="text-white/90 text-sm mt-1">Completa la información para continuar</p>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-6 relative z-10">
                            {/* Selected Tickets Summary */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">🎟️</span>
                                    <div className="text-sm font-semibold text-gray-700">Boletos seleccionados</div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedTickets.sort((a, b) => a - b).map((ticket) => (
                                        <span key={ticket} className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                                            {String(ticket).padStart(3, '0')}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-3 border-t-2 border-green-200 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-700">Total a pagar</span>
                                    <span className="text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                        ${selectedTickets.length * RAFFLE_DATA.price}
                                    </span>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <Label htmlFor="customer-name" className="text-sm font-bold text-gray-800 mb-2 block flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" />
                                        Nombre Completo *
                                    </Label>
                                    <Input
                                        id="customer-name"
                                        type="text"
                                        placeholder="Ej: Juan Pérez García"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="h-12 text-base border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <Label htmlFor="customer-phone" className="text-sm font-bold text-gray-800 mb-2 block flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Teléfono *
                                    </Label>
                                    <Input
                                        id="customer-phone"
                                        type="tel"
                                        placeholder="Ej: 5512345678"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="h-12 text-base border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white font-mono"
                                        maxLength={10}
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5 ml-1">📱 10 dígitos sin espacios</p>
                                </div>

                                {/* State */}
                                <div>
                                    <Label htmlFor="customer-state" className="text-sm font-bold text-gray-800 mb-2 block flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Estado *
                                    </Label>
                                    <select
                                        id="customer-state"
                                        value={customerState}
                                        onChange={(e) => setCustomerState(e.target.value)}
                                        className="w-full h-12 px-4 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white font-medium text-gray-900"
                                    >
                                        <option value="" className="text-gray-400">Selecciona tu estado</option>
                                        {MEXICAN_STATES.map((state) => (
                                            <option key={state} value={state} className="text-gray-900">
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    size="lg"
                                    className="w-full h-13 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                                    disabled={!customerName.trim() || !customerPhone.trim() || customerPhone.length !== 10 || !customerState}
                                    onClick={() => setCheckoutStep('payment-confirmation')}
                                >
                                    Continuar →
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold text-gray-700"
                                    onClick={() => setCheckoutStep('selection')}
                                >
                                    ← Volver
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            {checkoutStep === 'payment-confirmation' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-in slide-in-from-bottom duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-center relative">
                            <button
                                onClick={() => setCheckoutStep('customer-form')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="text-5xl mb-2">✅</div>
                            <h2 className="text-2xl font-bold text-white">¡Boletos Apartados!</h2>
                            <p className="text-white/90 text-sm mt-1">Realiza tu pago para confirmar</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Purchase Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-3">Resumen de Compra</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Rifa:</span>
                                        <span className="font-semibold text-gray-900">{RAFFLE_DATA.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Boletos:</span>
                                        <span className="font-semibold text-gray-900">
                                            {selectedTickets.sort((a, b) => a - b).join(', ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cantidad:</span>
                                        <span className="font-semibold text-gray-900">{selectedTickets.length} boleto(s)</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-gray-900 font-bold">Total:</span>
                                        <span className="text-2xl font-black text-primary">
                                            ${selectedTickets.length * RAFFLE_DATA.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-3">Tus Datos</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Nombre:</span>
                                        <span className="font-semibold text-gray-900">{customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Teléfono:</span>
                                        <span className="font-semibold text-gray-900">{customerPhone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className="font-semibold text-gray-900">{customerState}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-xl">💳</span>
                                    Datos para Transferencia
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Banco</div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                            <span className="font-semibold text-gray-900">{PAYMENT_DATA.bankName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Titular</div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                            <span className="font-semibold text-gray-900">{PAYMENT_DATA.accountHolder}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Número de Cuenta</div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                            <span className="font-mono font-semibold text-gray-900">{PAYMENT_DATA.accountNumber}</span>
                                            <button
                                                onClick={() => copyToClipboard(PAYMENT_DATA.accountNumber, 'account')}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {copiedField === 'account' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">CLABE Interbancaria</div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                            <span className="font-mono font-semibold text-gray-900">{PAYMENT_DATA.clabe}</span>
                                            <button
                                                onClick={() => copyToClipboard(PAYMENT_DATA.clabe, 'clabe')}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {copiedField === 'clabe' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Note */}
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-800">
                                    <strong>Importante:</strong> Una vez realizada la transferencia, envía tu comprobante de pago por WhatsApp para confirmar tu apartado.
                                </p>
                            </div>

                            {/* Action Button */}
                            <Button
                                size="lg"
                                className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base flex items-center justify-center gap-2"
                                onClick={handleWhatsAppRedirect}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Enviar Comprobante de Pago
                            </Button>
                        </div>
                    </div>
                </div>
            )}



            {/* CTA Section - Only show in selection step */}
            {checkoutStep === 'selection' && <CreateRaffleCTA />}

            {/* Trust Banner - Fixed Bottom */}
            {selectedTickets.length === 0 && checkoutStep === 'selection' && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-50 border-t border-emerald-100 py-2 text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700">
                        <ShieldCheck className="w-4 h-4" />
                        Estos sorteos son seguros
                    </div>
                </div>
            )}
        </div>
    )
}
