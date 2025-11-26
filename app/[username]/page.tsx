import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Raffle } from "../types"

// Mock Data Fetcher
async function getOrganizer(username: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    if (username === "demo") {
        return {
            id: "user1",
            name: "Club Deportivo Demo",
            username: "demo",
            bio: "Organizamos rifas para apoyar el deporte local. ¡Participa y gana grandes premios!",
            avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CD"
        }
    }
    return null
}

async function getOrganizerRaffles(organizerId: string): Promise<Raffle[]> {
    return [
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
        }
    ]
}

export default async function OrganizerProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const organizer = await getOrganizer(username)

    if (!organizer) {
        notFound()
    }

    const raffles = await getOrganizerRaffles(organizer.id)

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header Profile */}
            <div className="bg-background border-b">
                <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
                    <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-xl">
                        {organizer.name.substring(0, 2)}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{organizer.name}</h1>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            {organizer.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* Raffles Grid */}
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
                <h2 className="text-xl font-semibold">Sorteos Disponibles</h2>

                <div className="grid gap-6">
                    {raffles.map((raffle) => (
                        <Link key={raffle.id} href={`/${username}/${raffle.id}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image Placeholder */}
                                    <div className="w-full sm:w-48 h-48 bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 transition-colors">
                                        <span className="text-4xl">🎁</span>
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={raffle.status === 'active' ? 'success' : 'secondary'}>
                                                    {raffle.status === 'active' ? 'En Curso' : 'Finalizada'}
                                                </Badge>
                                                <span className="font-bold text-lg text-primary">
                                                    ${raffle.price}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {raffle.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {raffle.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                {raffle.totalTickets - raffle.soldTickets} boletos restantes
                                            </span>
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                Ver detalles →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
