"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Save,
    Upload
} from "lucide-react"

export default function CustomizePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Personalizar Perfil</h1>
                <p className="text-gray-500 mt-1">Gestiona la información pública de tu organización.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Esta información será visible para todos los visitantes de tu perfil.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="orgName">Nombre de la Organización</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="orgName" placeholder="Ej. Club Deportivo" className="pl-10" defaultValue="Club Deportivo Demo" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía / Descripción</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Cuéntanos sobre tu organización..."
                                    className="min-h-[100px]"
                                    defaultValue="Organizamos rifas para apoyar el deporte local. ¡Participa y gana grandes premios!"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="email" type="email" placeholder="contacto@ejemplo.com" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="phone" placeholder="+52 123 456 7890" className="pl-10" defaultValue="521234567890" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Redes Sociales</CardTitle>
                            <CardDescription>
                                Conecta tus perfiles sociales para aumentar tu alcance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <Facebook className="w-5 h-5" />
                                </div>
                                <Input placeholder="URL de Facebook" className="flex-1" defaultValue="https://facebook.com" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white">
                                    <Instagram className="w-5 h-5" />
                                </div>
                                <Input placeholder="URL de Instagram" className="flex-1" defaultValue="https://instagram.com" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <Input placeholder="URL de Twitter" className="flex-1" defaultValue="https://twitter.com" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Branding & Save */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Marca e Imagen</CardTitle>
                            <CardDescription>
                                Personaliza la apariencia de tu perfil.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label>Logo / Avatar</Label>
                                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer bg-gray-50">
                                    <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-900">Sube tu logo</p>
                                        <p className="text-xs text-gray-500">PNG, JPG hasta 2MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Color Principal</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['#1dadfb', '#ef4444', '#22c55e', '#a855f7', '#f97316'].map((color) => (
                                        <button
                                            key={color}
                                            className="w-full aspect-square rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-2 ring-transparent hover:ring-gray-200"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="sticky top-24">
                        <Button className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                            <Save className="w-5 h-5 mr-2" />
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
