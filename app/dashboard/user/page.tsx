"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import {
    User,
    Lock,
    CreditCard,
    Shield,
    LogOut,
    Zap
} from "lucide-react"

export default function UserProfilePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración de Cuenta</h1>
                <p className="text-gray-500 mt-1">Administra tu cuenta personal y suscripción.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Datos Personales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre Completo</Label>
                                    <Input defaultValue="Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Correo Electrónico</Label>
                                    <Input defaultValue="juan@ejemplo.com" disabled className="bg-gray-50" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                Seguridad
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Contraseña Actual</Label>
                                <Input type="password" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nueva Contraseña</Label>
                                    <Input type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirmar Contraseña</Label>
                                    <Input type="password" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline">Actualizar Contraseña</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subscription & Danger Zone */}
                <div className="space-y-8">
                    <Card className="border-primary/20 bg-gradient-to-br from-white to-blue-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Tu Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Plan Pro</h3>
                                    <p className="text-sm text-gray-500">$399 MXN / mes</p>
                                </div>
                                <Badge className="bg-primary text-white px-3 py-1">Activo</Badge>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span>3 Sorteos Activos</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span>Soporte Prioritario</span>
                                </div>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90">
                                Gestionar Suscripción
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <LogOut className="w-5 h-5" />
                                Zona de Peligro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4">
                                Si eliminas tu cuenta, perderás acceso a todas tus rifas y datos de forma permanente.
                            </p>
                            <Button variant="destructive" className="w-full">
                                Eliminar Cuenta
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
