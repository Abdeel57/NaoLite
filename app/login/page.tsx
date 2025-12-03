"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Credenciales incorrectas')
                setIsLoading(false)
                return
            }

            localStorage.setItem('currentUser', JSON.stringify(data.user))
            localStorage.setItem('lastLogin', new Date().toISOString())

            if (data.user.role === 'ADMIN') {
                router.push('/admin')
            } else {
                router.push(`/${data.user.username}`)
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Error al iniciar sesión. Intenta de nuevo.')
            setIsLoading(false)
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

            {/* Login Card */}
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
                        <CardTitle className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</CardTitle>
                        <CardDescription className="text-sm text-gray-600 max-w-sm mx-auto">
                            Ingresa a tu cuenta para gestionar tus rifas
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Correo Electrónico o Usuario
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="tu@email.com o usuario"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Contraseña
                                </Label>
                                <Link href="#" className="text-xs text-primary hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-11 h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            {!isLoading && <LogIn className="ml-2 w-5 h-5" />}
                        </Button>

                        {/* Signup Link */}
                        <p className="text-center text-sm text-gray-600 pt-4">
                            ¿No tienes cuenta?{" "}
                            <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                                Regístrate gratis
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
