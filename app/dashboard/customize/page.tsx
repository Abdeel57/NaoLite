"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { useAuth } from "../../components/auth/auth-context"
import {
    User,
    Mail,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    Save,
    Upload,
    Image as ImageIcon,
    Loader2,
    Trash2
} from "lucide-react"

export default function CustomizePage() {
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        email: "",
        phone: "",
        facebook: "",
        instagram: "",
        twitter: "",
        primaryColor: "#1dadfb", // Default blue
        logoData: "",
        bannerData: ""
    })

    useEffect(() => {
        if (currentUser?.username) {
            loadProfile()
        }
    }, [currentUser])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/user/profile?username=${currentUser?.username}`)
            if (res.ok) {
                const data = await res.json()
                setFormData({
                    name: data.name || "",
                    bio: data.bio || "",
                    email: data.email || "",
                    phone: data.phone || data.whatsapp || "",
                    facebook: data.facebook || "",
                    instagram: data.instagram || "",
                    twitter: data.twitter || "",
                    primaryColor: data.primaryColor || "#1dadfb",
                    logoData: data.logoData || "",
                    bannerData: data.bannerData || ""
                })
            }
        } catch (error) {
            console.error("Error loading profile:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoData' | 'bannerData') => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("La imagen es demasiado grande. Máximo 2MB.")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = (field: 'logoData' | 'bannerData') => {
        setFormData(prev => ({ ...prev, [field]: "" }))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: currentUser?.username,
                    ...formData
                })
            })

            if (res.ok) {
                alert("Perfil actualizado correctamente")
            } else {
                const error = await res.json()
                alert(error.error || "Error al guardar")
            }
        } catch (error) {
            console.error("Error saving profile:", error)
            alert("Error al guardar cambios")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Personalizar Perfil</h1>
                <p className="text-gray-500 mt-1">Gestiona la información pública y apariencia de tu organización.</p>
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
                                <Label htmlFor="name">Nombre Público (Título del Perfil)</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Club Deportivo" className="pl-10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía / Descripción</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Cuéntanos sobre tu organización..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contacto@ejemplo.com" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+52 123 456 7890" className="pl-10" />
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
                                <Input id="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="URL de Facebook" className="flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white">
                                    <Instagram className="w-5 h-5" />
                                </div>
                                <Input id="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="URL de Instagram" className="flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <Input id="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="URL de Twitter" className="flex-1" />
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
                            {/* Logo Upload */}
                            <div className="space-y-4">
                                <Label>Logo de la Organización</Label>
                                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary/50 transition-colors bg-gray-50 relative group">
                                    {formData.logoData ? (
                                        <>
                                            <img src={formData.logoData} alt="Logo Preview" className="w-24 h-24 object-contain rounded-lg shadow-sm" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage('logoData')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-900">Sube tu logo</p>
                                                <p className="text-xs text-gray-500">PNG, JPG hasta 2MB</p>
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, 'logoData')}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Banner Upload */}
                            <div className="space-y-4">
                                <Label>Banner de Fondo (Hero)</Label>
                                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary/50 transition-colors bg-gray-50 relative group">
                                    {formData.bannerData ? (
                                        <>
                                            <div className="w-full h-24 rounded-lg overflow-hidden shadow-sm relative">
                                                <img src={formData.bannerData} alt="Banner Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage('bannerData')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full h-20 bg-white shadow-md flex items-center justify-center rounded-lg">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-900">Sube un Banner</p>
                                                <p className="text-xs text-gray-500">Recomendado: 1200x400px</p>
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, 'bannerData')}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Primary Color Picker */}
                            <div className="space-y-4">
                                <Label>Color Primario</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md border border-gray-200">
                                        <input
                                            type="color"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                    <Input
                                        value={formData.primaryColor}
                                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                                        className="font-mono uppercase"
                                        maxLength={7}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Este color se aplicará a botones, encabezados y elementos destacados.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="sticky top-24">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
