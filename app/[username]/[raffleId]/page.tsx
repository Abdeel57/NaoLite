"use client"

import { useState, use } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

// Mock Data (In real app, fetch based on ID)
const RAFFLE_DATA = {
    id: "1",
    title: "Gran Sorteo de Fin de Año",
    description: "¡Participa para ganar un iPhone 15 Pro Max! El sorteo se realizará en vivo por Instagram.",
    price: 50,
    totalTickets: 100,
    soldTickets: [1, 2, 5, 10, 15, 20, 45, 99], // Mock sold ticket numbers
    organizerPhone: "521234567890" // Mock WhatsApp number
}

export default function RaffleDetailPage({ params }: { params: Promise<{ username: string; raffleId: string }> }) {
    const { username, raffleId } = use(params)
    const [selectedTickets, setSelectedTickets] = useState<number[]>([])
    const [customerName, setCustomerName] = useState("")

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

        const message = `Hola, quiero comprar los boletos: ${ticketString} para la rifa "${RAFFLE_DATA.title}".
    
Mis datos:
Nombre: ${customerName}
Total a pagar: $${total}

¿Me confirmas la cuenta para depositar?`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${RAFFLE_DATA.organizerPhone}?text=${encodedMessage}`

        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={`/${username}`} className="text-sm font-medium hover:underline">
                        ← Volver al perfil
                    </Link>
                    <span className="font-bold text-lg">NaoLite</span>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {/* Raffle Info */}
                <div className="space-y-4">
                    <Badge variant="success" className="mb-2">En Curso</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{RAFFLE_DATA.title}</h1>
                    <p className="text-lg text-muted-foreground">{RAFFLE_DATA.description}</p>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                            ${RAFFLE_DATA.price} por boleto
                        </div>
                        <div className="text-muted-foreground">
                            {RAFFLE_DATA.totalTickets - RAFFLE_DATA.soldTickets.length} disponibles
                        </div>
                    </div>
                </div>

                {/* Ticket Grid */}
                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0">
                        <h3 className="text-lg font-semibold mb-4">Selecciona tus números</h3>
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {Array.from({ length: RAFFLE_DATA.totalTickets }, (_, i) => i + 1).map((number) => {
                                const isSold = RAFFLE_DATA.soldTickets.includes(number)
                                const isSelected = selectedTickets.includes(number)

                                return (
                                    <button
                                        key={number}
                                        disabled={isSold}
                                        onClick={() => toggleTicket(number)}
                                        className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
                      ${isSold
                                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50 decoration-slice line-through"
                                                : isSelected
                                                    ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-2 ring-primary ring-offset-2"
                                                    : "bg-card border hover:border-primary hover:bg-primary/5"
                                            }
                    `}
                                    >
                                        {number}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info Form */}
                {selectedTickets.length > 0 && (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 space-y-4 p-6 bg-muted/30 rounded-xl border">
                        <h3 className="font-semibold">Tus Datos</h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                placeholder="Tu nombre para apartar los boletos"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-2xl">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <div className="text-sm text-muted-foreground">Total a pagar</div>
                        <div className="text-2xl font-bold">
                            ${selectedTickets.length * RAFFLE_DATA.price}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
                        disabled={selectedTickets.length === 0 || !customerName}
                        onClick={handleWhatsAppRedirect}
                    >
                        {selectedTickets.length === 0
                            ? "Selecciona boletos"
                            : `Apartar ${selectedTickets.length} boletos por WhatsApp`
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}
