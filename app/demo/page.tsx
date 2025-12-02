"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, LayoutDashboard, UserCircle, Play } from "lucide-react"

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex flex-col">
            {/* Navbar */}
            <header className="w-full p-6">
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
            <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-12">
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
                        {/* Organizer View */}
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group text-left overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl text-white">Vista Organizador</CardTitle>
                                <CardDescription className="text-white/70">
                                    Accede al panel de control administrativo. Crea rifas, gestiona boletos y ver las estadísticas de ventas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/dashboard">
                                    <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                                        Entrar al Dashboard
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Participant View */}
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group text-left overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UserCircle className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl text-white">Vista Participante</CardTitle>
                                <CardDescription className="text-white/70">
                                    Mira cómo ven tus clientes tu perfil público. Selecciona boletos y experimenta el proceso de compra.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/demo-user">
                                    <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold">
                                        Ver Perfil Público
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
