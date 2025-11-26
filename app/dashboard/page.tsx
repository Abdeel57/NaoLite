"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { FadeIn, SlideUp, StaggerContainer, ScaleIn } from "../../components/ui/motion"
import { ArrowUpRight, DollarSign, Ticket, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <SlideUp>
                    <h2 className="text-3xl font-bold tracking-tight">Hola, Club Deportivo 👋</h2>
                    <p className="text-muted-foreground">Aquí tienes el resumen de tu actividad hoy.</p>
                </SlideUp>
                <SlideUp delay={0.1}>
                    <Button className="bg-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                        + Nueva Rifa
                    </Button>
                </SlideUp>
            </div>

            <StaggerContainer className="grid gap-4 md:grid-cols-3">
                <ScaleIn delay={0.1}>
                    <Card className="glass hover:border-primary/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$1,250.00</div>
                            <p className="text-xs text-green-500 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" /> +20.1% desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                </ScaleIn>

                <ScaleIn delay={0.2}>
                    <Card className="glass hover:border-primary/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Boletos Vendidos</CardTitle>
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Ticket className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-blue-500 flex items-center mt-1">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +12 nuevos hoy
                            </p>
                        </CardContent>
                    </Card>
                </ScaleIn>

                <ScaleIn delay={0.3}>
                    <Card className="glass hover:border-primary/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Rifas Activas</CardTitle>
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Users className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                1 finaliza esta semana
                            </p>
                        </CardContent>
                    </Card>
                </ScaleIn>
            </StaggerContainer>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <SlideUp delay={0.4} className="col-span-4">
                    <Card className="h-full border-none shadow-none bg-transparent">
                        <CardHeader className="px-0">
                            <CardTitle>Rifas Recientes</CardTitle>
                            <CardDescription>
                                Tus sorteos con mayor actividad este mes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border hover:border-primary/20 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-muted group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                                            <Ticket className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium group-hover:text-primary transition-colors">Gran Sorteo iPhone 15</div>
                                            <div className="text-sm text-muted-foreground">Finaliza en 5 días</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">$450.00</div>
                                        <div className="text-xs text-muted-foreground">45/100 vendidos</div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </SlideUp>

                <SlideUp delay={0.5} className="col-span-3">
                    <Card className="h-full glass border-primary/10">
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                            <CardDescription>
                                Últimas ventas de boletos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">Juan Pérez</p>
                                            <p className="text-xs text-muted-foreground">
                                                Compró 2 boletos para "Sorteo iPhone"
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-green-500">+$20.00</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </SlideUp>
            </div>
        </div>
    )
}
