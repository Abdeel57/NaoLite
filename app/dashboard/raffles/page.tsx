"use client"

import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { FadeIn, SlideUp, StaggerContainer, ScaleIn } from "../../components/ui/motion"
import { Raffle } from "../../types"

// Mock Data
const mockRaffles: Raffle[] = [
    {
        id: "1",
        title: "Gran Sorteo de Fin de Año",
        description: "Gana un iPhone 15 Pro Max y muchos premios más.",
        price: 50,
        totalTickets: 100,
        soldTickets: 45,
        status: "active",
        endDate: "2024-12-31",
        organizerId: "user1"
    },
    {
        id: "2",
        title: "Rifa Solidaria",
        description: "Apoya a nuestra causa y gana una cena para dos.",
        price: 20,
        totalTickets: 200,
        soldTickets: 200,
        status: "sold_out",
        endDate: "2024-11-30",
        organizerId: "user1"
    },
    {
        id: "3",
        title: "Sorteo Express",
        description: "Rifa rápida de fin de semana.",
        price: 10,
        totalTickets: 50,
        soldTickets: 0,
        status: "draft",
        endDate: "2024-12-05",
        organizerId: "user1"
    }
]

export default function RafflesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <SlideUp>
                    <h2 className="text-3xl font-bold tracking-tight">Mis Rifas</h2>
                    <p className="text-muted-foreground">
                        Gestiona tus sorteos activos y pasados.
                    </p>
                </SlideUp>
                <SlideUp delay={0.1}>
                    <Link href="/dashboard/raffles/create">
                        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            + Nueva Rifa
                        </Button>
                    </Link>
                </SlideUp>
            </div>

            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockRaffles.map((raffle) => (
                    <ScaleIn key={raffle.id}>
                        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 group glass h-full">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant={
                                        raffle.status === 'active' ? 'success' :
                                            raffle.status === 'sold_out' ? 'secondary' :
                                                'outline'
                                    }>
                                        {raffle.status === 'active' ? 'Activa' :
                                            raffle.status === 'sold_out' ? 'Agotada' :
                                                'Borrador'}
                                    </Badge>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        ${raffle.price} / boleto
                                    </span>
                                </div>
                                <CardTitle className="line-clamp-1 mt-2 group-hover:text-primary transition-colors">
                                    {raffle.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {raffle.description}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progreso</span>
                                        <span>{raffle.soldTickets} / {raffle.totalTickets} vendidos</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                            style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-4 pt-4 mt-auto">
                                <Link href={`/dashboard/raffles/${raffle.id}`} className="w-full">
                                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors border-primary/20">
                                        Gestionar
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </ScaleIn>
                ))}
            </StaggerContainer>
        </div>
    )
}
