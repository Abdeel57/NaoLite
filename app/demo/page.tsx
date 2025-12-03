"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, LayoutDashboard, UserCircle, Play } from "lucide-react"

export default function DemoPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex flex-col relative overflow-hidden">
            {/* Animated Clover Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* 4-Heart Clover SVGs matching reference image - WHITE for contrast */}
                <svg className="absolute top-[10%] left-[15%] w-16 h-16 text-white/35" style={{ animation: 'float-clover 8s ease-in-out infinite' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
                <svg className="absolute top-[60%] left-[8%] w-20 h-20 text-white/25" style={{ animation: 'float-clover-slow 12s ease-in-out infinite 2s' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
                <svg className="absolute top-[25%] right-[12%] w-24 h-24 text-white/30" style={{ animation: 'float-clover 10s ease-in-out infinite 1s' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
                <svg className="absolute top-[70%] right-[20%] w-18 h-18 text-white/25" style={{ animation: 'float-clover-slow 14s ease-in-out infinite 3s' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
                <svg className="absolute top-[45%] left-[50%] w-14 h-14 text-white/20" style={{ animation: 'float-clover 9s ease-in-out infinite 4s' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
                <svg className="absolute top-[15%] right-[35%] w-22 h-22 text-white/25" style={{ animation: 'float-clover-slow 11s ease-in-out infinite 1.5s' }} viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="35" cy="30" r="20" />
                    <circle cx="65" cy="30" r="20" />
                    <circle cx="35" cy="60" r="20" />
                    <circle cx="65" cy="60" r="20" />
                    <path d="M 50 70 Q 45 85 40 95 Q 50 90 50 70 Z" />
                </svg>
            </div>

            {/* Navbar */}
            <header className="w-full p-6 relative z-10">
                <div className="container mx-auto">
                    <Link
                        href="/"
                        className="text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium w-fit"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver al inicio</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-12 relative z-10">
                <div className="max-w-4xl w-full space-y-12 text-center">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white mb-4">
                            <Play className="w-4 h-4 fill-current" />
                            Demo Interactivo
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white">
                            Experimenta NaoLite
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Explora la plataforma desde dos perspectivas diferentes. Elige cómo quieres ver la experiencia.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Organizer View - Clickable Card */}
                        <Link href="/demo-user?admin=true" className="block group relative z-50">
                            <Card className="bg-white hover:shadow-2xl transition-all duration-300 text-left overflow-hidden relative h-full border-2 border-gray-100 hover:border-primary">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <CardHeader className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <LayoutDashboard className="w-7 h-7 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900">Vista Organizador</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Accede al panel de control administrativo. Crea rifas, gestiona boletos y ver las estadísticas de ventas.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-primary text-white hover:bg-primary/90 font-bold shadow-md">
                                        Entrar al Administrador
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Participant View - Clickable Card */}
                        <Link href="/demo-user" className="block group relative z-50">
                            <Card className="bg-white hover:shadow-2xl transition-all duration-300 text-left overflow-hidden relative h-full border-2 border-gray-100 hover:border-primary">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <CardHeader className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <UserCircle className="w-7 h-7 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl text-gray-900">Vista Participante</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Mira cómo ven tus clientes tu perfil público. Selecciona boletos y experimenta el proceso de compra.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-primary text-white hover:bg-primary/90 font-bold shadow-md">
                                        Ver Perfil Público
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
