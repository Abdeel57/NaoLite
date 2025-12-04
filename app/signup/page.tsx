"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, User, Mail, Lock, Ticket } from "lucide-react"
import { useAuth } from "../components/auth/auth-context"

// Plan details for WhatsApp message
const PLANS_INFO: Record<string, { name: string; price: number; emoji: string; features: string[] }> = {
    basic: {
        name: "Básico",
        price: 250,
        emoji: "⚡",
        features: ["1 rifa activa", "100 boletos", "Perfil público"]
    },
    pro: {
        name: "Pro",
        price: 399,
        emoji: "👑",
        features: ["3 sorteos activos", "1,000 boletos", "Logo profesional"]
    },
    premium: {
        name: "Premium",
        price: 799,
        emoji: "🚀",
        features: ["Sorteos ilimitados", "Boletos ilimitados", "Soporte 24/7"]
    }
}

function SignupForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signup, selectPlan } = useAuth()
    const selectedPlanId = searchParams.get("plan")

    const [formData, setFormData] = useState({
        name: "",
        raffleName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        passwordMatch: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setErrors({ passwordMatch: "Las contraseñas no coinciden" })
            return
        }

        setErrors({ passwordMatch: "" })

        // Create username from raffle name (lowercase, no spaces)
        const username = formData.raffleName.toLowerCase().replace(/\s+/g, '-')

        // Save user data using auth context
        signup({
            username,
            name: formData.name,
            email: formData.email,
            password: formData.password
        })

        // If a plan was pre-selected from landing page
        if (selectedPlanId && PLANS_INFO[selectedPlanId]) {
            // Save plan
            selectPlan(selectedPlanId)

            // Trigger WhatsApp redirect logic
            const plan = PLANS_INFO[selectedPlanId]

            setTimeout(() => {
                const message = `🎉 *¡Hola! Nuevo Cliente Interesado* 🎉

👤 *Nombre:* ${formData.name}
🎫 *Nombre de Rifa:* ${username}

${plan.emoji} *Plan Seleccionado:* ${plan.name}
💰 *Precio:* $${plan.price} MXN/mes

📋 *Características incluidas:*
${plan.features.map((f, i) => `${i + 1}. ✅ ${f}`).join('\n')}

✨ Estoy listo para iniciar mi rifa en *NaoLite* y me gustaría recibir más información sobre cómo empezar.

¿Me pueden ayudar con el proceso de activación? 🙌`

                const encodedMessage = encodeURIComponent(message)
                const phoneNumber = '5216625260350'

                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
            }, 500)

            // Redirect directly to profile
            router.push(`/${username}`)
        } else {
            // No plan selected, go to plans page
            router.push("/plans")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium z-10"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
            </Link>

            {/* Signup Card */}
            <Card className="w-full max-w-md relative z-10 shadow-2xl bg-white border-0">
                <CardHeader className="space-y-3 text-center pb-8 pt-8">
                    {/* Logo and Brand */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <Image src="/naolite-logo-blue.png" alt="NaoLite" fill className="object-contain" />
                        </div>
                        <span className="text-3xl font-bold text-primary tracking-tight">NaoLite</span>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-gray-900">Crear Cuenta</CardTitle>
                        <CardDescription className="text-sm text-gray-600 max-w-sm mx-auto">
                            {selectedPlanId ? (
                                <span>Estás a un paso de activar tu plan <span className="font-bold text-primary">{PLANS_INFO[selectedPlanId]?.name || ''}</span></span>
                            ) : (
                                "Crea tu perfil de NaoLite y comienza a organizar rifas"
                            )}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                Nombre Completo
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Raffle Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="raffleName" className="text-sm font-semibold text-gray-700">
                                Nombre de Rifas
                            </Label>
                            <div className="relative">
                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="raffleName"
                                    type="text"
                                    placeholder="Club Deportivo"
                                    value={formData.raffleName}
                                    onChange={(e) => setFormData({ ...formData, raffleName: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                                Nombre de tu organización o perfil de rifas
                            </p>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                Confirmar Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                    minLength={8}
                                />
                            </div>
                            {errors.passwordMatch && (
                                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                    {errors.passwordMatch}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                        >
                            {selectedPlanId ? "Continuar a WhatsApp" : "Crear mi Perfil"}
                        </Button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 pt-4">
                            ¿Ya tienes cuenta?{" "}
                            <Link href="/login" className="text-primary font-semibold hover:underline transition-colors">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SignupForm />
        </Suspense>
    )
}
