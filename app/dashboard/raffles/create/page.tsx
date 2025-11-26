"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { FadeIn, SlideUp } from "../../components/ui/motion"

export default function CreateRafflePage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
        // In a real app, redirect or show success
        alert("Rifa creada con éxito (Simulación)")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <SlideUp className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Crear Nueva Rifa</h2>
                    <p className="text-muted-foreground">
                        Configura los detalles de tu sorteo para comenzar a vender boletos.
                    </p>
                </SlideUp>
                <SlideUp delay={0.1}>
                    <Link href="/dashboard/raffles">
                        <Button variant="ghost">Cancelar</Button>
                    </Link>
                </SlideUp>
            </div>

            <FadeIn delay={0.2}>
                <Card className="border-primary/20 shadow-2xl glass">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Detalles del Sorteo</CardTitle>
                            <CardDescription>
                                La información básica que verán tus participantes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título de la Rifa</Label>
                                <Input id="title" placeholder="Ej. Gran Rifa Navideña" required className="bg-background/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe los premios y la dinámica..."
                                    className="min-h-[120px] bg-background/50 border-input focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Precio del Boleto ($)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input id="price" type="number" min="0" step="0.01" className="pl-7 bg-background/50" placeholder="0.00" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tickets">Total de Boletos</Label>
                                    <Input id="tickets" type="number" min="1" placeholder="100" required className="bg-background/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">Fecha del Sorteo</Label>
                                <Input id="endDate" type="date" required className="bg-background/50" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 border-t border-white/10 bg-muted/30 p-6">
                            <Button variant="outline" type="button" disabled={isLoading}>
                                Guardar Borrador
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                                {isLoading ? "Creando..." : "Publicar Rifa"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </FadeIn>
        </div>
    )
}
