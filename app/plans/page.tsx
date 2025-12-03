"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Check, ArrowLeft, Zap, Crown, Rocket, Sparkles } from "lucide-react"
import { useAuth } from "../components/auth/auth-context"

const plans = [
    {
        id: "basic",
        name: "Básico",
        icon: Zap,
        price: 250,
        period: "por mes",
        description: "Ideal para empezar con tu primera rifa",
        gradient: "from-gray-400 via-gray-500 to-gray-600",
        features: [
            "1 rifa activa",
            "100 boletos por rifa",
            "Perfil público",
            "Automatización a WhatsApp",
            "Atención al cliente",
        ],
        popular: false,
    },
    {
        id: "pro",
        name: "Pro",
        icon: Crown,
        price: 399,
        period: "por mes",
        description: "Para organizadores que van en serio",
        gradient: "from-primary via-blue-500 to-secondary",
        features: [
            "3 sorteos activos",
            "1,000 boletos por sorteo",
            "Automatización a WhatsApp",
            "Diseño de logo profesional",
            "Soporte prioritario 24/7",
        ],
        popular: true,
    },
    {
        id: "premium",
        name: "Premium",
        icon: Rocket,
        price: 799,
        period: "por mes",
        description: "La solución completa para profesionales",
        gradient: "from-yellow-500 via-amber-500 to-orange-500",
        features: [
            "Sorteos ilimitados",
            "Boletos ilimitados por sorteo",
            "Diseño de logo profesional",
            "Múltiples usuarios y roles",
            "Insignia de usuario verificado",
            "Asesoría y capacitación",
            "Atención personalizada 24/7",
        ],
        popular: false,
    },
]

export default function PlansPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>("pro")
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
    const { selectPlan, currentUser } = useAuth()

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId)

        // Find the selected plan
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        // Save plan and redirect to profile (this triggers the redirect)
        selectPlan(planId)

        // After a short delay, open WhatsApp in a new tab
        setTimeout(() => {
            if (currentUser) {
                const userName = currentUser.name
                const raffleName = currentUser.username

                // Get plan emoji
                const planEmoji = plan.id === 'basic' ? '⚡' : plan.id === 'pro' ? '👑' : '🚀'

                // Create structured WhatsApp message
                const message = `🎉 *¡Hola! Nuevo Cliente Interesado* 🎉

👤 *Nombre:* ${userName}
🎫 *Nombre de Rifa:* ${raffleName}

${planEmoji} *Plan Seleccionado:* ${plan.name}
💰 *Precio:* $${plan.price} MXN/mes

📋 *Características incluidas:*
${plan.features.map((f, i) => `${i + 1}. ✅ ${f}`).join('\n')}

✨ Estoy listo para iniciar mi rifa en *NaoLite* y me gustaría recibir más información sobre cómo empezar.

¿Me pueden ayudar con el proceso de activación? 🙌`

                // Encode message for URL
                const encodedMessage = encodeURIComponent(message)

                // WhatsApp number
                const phoneNumber = '5216625260350' // +52 662-526-0350

                // Open WhatsApp in new tab
                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
            }
        }, 500) // Small delay to ensure redirect happens first
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <Image src="/naolite-logo-blue.png" alt="NaoLite" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                NaoLite
                            </span>
                        </Link>
                        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Volver al inicio</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Planes y Precios</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Elige el plan perfecto
                        <br />
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent">
                            para tus rifas
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Planes diseñados para crecer contigo. Sin sorpresas, sin comisiones ocultas.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-full">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Anual
                            <Badge className="ml-2 bg-green-500 text-white text-xs">-20%</Badge>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => {
                        const Icon = plan.icon
                        const isSelected = selectedPlan === plan.id
                        const displayPrice = billingCycle === "yearly" ? Math.round(plan.price * 0.8) : plan.price

                        return (
                            <div key={plan.id} className={`relative group ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}>
                                {plan.popular && (
                                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-20">
                                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 text-sm font-bold shadow-lg">
                                            ⭐ Más Popular
                                        </Badge>
                                    </div>
                                )}

                                <Card
                                    className={`relative overflow-hidden h-full transition-all duration-300 bg-white ${plan.popular
                                        ? "border-2 border-primary shadow-2xl"
                                        : "border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl"
                                        } ${isSelected ? "ring-4 ring-primary/30 scale-[1.02]" : ""}`}
                                >
                                    {/* Gradient Top Bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${plan.gradient}`}></div>

                                    <div className="relative p-8">
                                        {/* Icon */}
                                        <div
                                            className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                                        {/* Price - ELECTRIC BLUE */}
                                        <div className="mb-8">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-5xl font-bold" style={{ color: "#1dadfb" }}>
                                                    ${displayPrice}
                                                </span>
                                                <span className="text-gray-600 font-medium">
                                                    /{billingCycle === "monthly" ? "mes" : "año"}
                                                </span>
                                            </div>
                                            {billingCycle === "yearly" && (
                                                <p className="text-sm text-green-600 font-semibold">
                                                    Ahorras ${plan.price * 12 * 0.2} MXN/año
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">{plan.period}</p>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-4 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div
                                                        className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5`}
                                                    >
                                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            onClick={() => handleSelectPlan(plan.id)}
                                            className={`w-full h-12 font-bold text-base transition-all duration-300 ${plan.popular
                                                ? `bg-gradient-to-r ${plan.gradient} hover:shadow-xl hover:scale-105 text-white`
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                                }`}
                                        >
                                            Seleccionar Plan
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )
                    })}
                </div>

                {/* Trust Indicators */}
                <div className="mt-20 text-center">
                    <p className="text-sm text-gray-500 mb-6">Confiado por organizadores en todo México</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-sm">Sin comisiones ocultas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-sm">Cancela cuando quieras</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-sm">Soporte en español</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Link */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Tienes preguntas?{" "}
                        <Link href="/contact" className="text-primary font-semibold hover:underline">
                            Contáctanos
                        </Link>
                        {" "}o revisa nuestras{" "}
                        <Link href="/faq" className="text-primary font-semibold hover:underline">
                            preguntas frecuentes
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
