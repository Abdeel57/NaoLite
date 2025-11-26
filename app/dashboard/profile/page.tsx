"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { FadeIn, SlideUp } from "../../components/ui/motion"
import { User, Camera, Save } from "lucide-react"

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "Club Deportivo Demo",
        username: "demo",
        phone: "521234567890",
        bio: "Organizamos rifas para apoyar el deporte local. ¡Participa y gana grandes premios!"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        alert("Perfil actualizado con éxito")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SlideUp>
                <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
                <p className="text-muted-foreground">
                    Gestiona tu información pública y datos de contacto.
                </p>
            </SlideUp>

            <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                {/* Avatar Section */}
                <FadeIn delay={0.1} className="space-y-6">
                    <Card className="glass border-primary/20">
                        <CardHeader>
                            <CardTitle>Imagen de Perfil</CardTitle>
                            <CardDescription>
                                Esta imagen será visible para todos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-background shadow-xl overflow-hidden">
                                    <span className="text-4xl font-bold text-primary">CD</span>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                Cambiar Imagen
                            </Button>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Form Section */}
                <FadeIn delay={0.2}>
                    <Card className="glass border-primary/20">
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Información General</CardTitle>
                                <CardDescription>
                                    Actualiza los detalles de tu organización.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre de la Organización</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-background/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nombre de Usuario</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">naolite.com/</span>
                                            <Input
                                                id="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="pl-24 bg-background/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">WhatsApp (para pagos)</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="521..."
                                        className="bg-background/50"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        A este número llegarán los mensajes de confirmación de compra.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biografía</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="min-h-[120px] bg-background/50"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t border-white/10 bg-muted/30 p-6">
                                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    <Save className="w-4 h-4 mr-2" />
                                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}
