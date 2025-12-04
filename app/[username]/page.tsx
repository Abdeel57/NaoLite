"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { notFound, useSearchParams } from "next/navigation"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Raffle } from "../types"
import { CreateRaffleCTA } from "../components/ui/create-raffle-cta"
import { Award, Ticket, TrendingUp, Facebook, Instagram, Twitter, MessageCircle, ChevronDown, Settings, ShieldCheck } from "lucide-react"
import { CountdownTimer } from "../components/ui/countdown-timer"
import { AdminSlidePanel } from "../components/ui/admin-slide-panel"
import { WelcomeTutorial } from "../components/tutorial/welcome-tutorial"
import { useAuth } from "../components/auth/auth-context"

// Mock Data Fetcher
function getOrganizer(username: string) {
    // Check if it's a demo user
    if (username === "demo" || username === "demo-user") {
        return {
            id: "user1",
            name: "Club Deportivo Demo",
            username: "demo-user",
            bio: "Organizamos rifas para apoyar el deporte local. ¡Participa y gana grandes premios!",
            avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CD",
            stats: {
                totalRaffles: 12,
                activeRaffles: 2,
                totalParticipants: 1500
            },
            socialLinks: {
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
                twitter: "https://twitter.com",
                whatsapp: "521234567890"
            },
            faqs: [
                {
                    question: "¿Cómo se eligen los ganadores?",
                    answer: "Los ganadores se eligen de acuerdo a los últimos dígitos de la Lotería Nacional."
                },
                {
                    question: "¿Qué pasa si no se venden todos los boletos?",
                    answer: "La rifa se pospone hasta que se venda el 80% de los boletos para garantizar la entrega del premio."
                },
                {
                    question: "¿Cómo reclamo mi premio?",
                    answer: "Nos pondremos en contacto contigo vía WhatsApp y correo electrónico para coordinar la entrega."
                }
            ]
        }
    }

    // For real users, get data from localStorage
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
            const user = JSON.parse(storedUser)
            if (user.username === username) {
                return {
                    id: user.username,
                    name: user.name,
                    username: user.username,
                    bio: "¡Bienvenido a mi perfil de rifas! Aquí podrás participar en sorteos increíbles.",
                    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
                    stats: {
                        totalRaffles: 0,
                        activeRaffles: 0,
                        totalParticipants: 0
                    },
                    socialLinks: {
                        facebook: "",
                        instagram: "",
                        twitter: "",
                        whatsapp: ""
                    },
                    faqs: []
                }
            }
        }
    }

    return null
}

function getOrganizerRaffles(organizerId: string): Raffle[] {
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

export default function OrganizerProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
    const [organizer, setOrganizer] = useState<any>(null)
    const [raffles, setRaffles] = useState<Raffle[]>([])
    const [loading, setLoading] = useState(true)
    const { username } = use(params)
    const searchParams = useSearchParams()
    
    // Auth and tutorial state - MUST be before any conditional returns
    const { currentUser, markTutorialComplete } = useAuth()
    const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false)
    const isOwner = currentUser?.username === username

    useEffect(() => {
        if (searchParams.get('admin') === 'true') {
            setIsAdminPanelOpen(true)
        }
    }, [searchParams])

    useEffect(() => {
        loadOrganizerData()
    }, [username])
    
    // Check if should show welcome tutorial
    useEffect(() => {
        if (currentUser && currentUser.isFirstTimeUser && isOwner) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                setShowWelcomeTutorial(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [currentUser, isOwner])

    const loadOrganizerData = async () => {
        try {
            // Cargar perfil del organizador
            const profileResponse = await fetch(`/api/user/profile?username=${username}`)
            if (!profileResponse.ok) {
                // Si no existe, usar datos demo o mostrar error
                const demoOrganizer = getOrganizer(username)
                if (demoOrganizer) {
                    setOrganizer(demoOrganizer)
                    const demoRaffles = getOrganizerRaffles(demoOrganizer.id)
                    setRaffles(demoRaffles)
                }
                setLoading(false)
                return
            }

            const profileData = await profileResponse.json()
            
            // Cargar rifas del organizador
            const rafflesResponse = await fetch(`/api/user/raffles?username=${username}`)
            let rafflesData = []
            if (rafflesResponse.ok) {
                rafflesData = await rafflesResponse.json()
            }

            // Calcular estadísticas
            const activeRafflesCount = rafflesData.filter((r: any) => r.status === 'ACTIVE').length
            const totalParticipants = rafflesData.reduce((sum: number, r: any) => sum + r.soldTickets, 0)

            setOrganizer({
                id: profileData.id,
                name: profileData.name,
                username: profileData.username,
                bio: profileData.bio || '¡Bienvenido a mi perfil de rifas! Aquí podrás participar en sorteos increíbles.',
                avatarUrl: profileData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`,
                stats: {
                    totalRaffles: rafflesData.length,
                    activeRaffles: activeRafflesCount,
                    totalParticipants
                },
                socialLinks: {
                    facebook: profileData.facebook || '',
                    instagram: profileData.instagram || '',
                    twitter: profileData.twitter || '',
                    whatsapp: profileData.whatsapp || profileData.phone || ''
                },
                faqs: []
            })

            // Convertir rifas al formato esperado
            const formattedRaffles = rafflesData.map((r: any) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                price: r.price,
                totalTickets: r.totalTickets,
                soldTickets: r.soldTickets,
                status: r.status.toLowerCase(),
                endDate: r.endDate,
                organizerId: r.organizerId
            }))

            setRaffles(formattedRaffles)
        } catch (error) {
            console.error('Error loading organizer data:', error)
            // Fallback a datos demo
            const demoOrganizer = getOrganizer(username)
            if (demoOrganizer) {
                setOrganizer(demoOrganizer)
                const demoRaffles = getOrganizerRaffles(demoOrganizer.id)
                setRaffles(demoRaffles)
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!organizer) {
        notFound()
    }

    const activeRaffles = raffles.filter(r => r.status === 'active')

    const handleWelcomeTutorialComplete = () => {
        setShowWelcomeTutorial(false)

        // Remove the admin tutorial flag to ensure it starts
        localStorage.removeItem("hasSeenAdminTutorial")

        // Open admin panel and mark user tutorial as complete
        setIsAdminPanelOpen(true)
        markTutorialComplete()
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Optimized */}
            <div className="relative bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-white">
                        {/* Avatar - Smaller */}
                        <div className="relative">
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-2xl">
                                {organizer.name.substring(0, 2)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white text-primary rounded-full p-2 shadow-lg">
                                <Award className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Info - Compact */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                                {organizer.name}
                            </h1>
                            <p className="text-sm md:text-base text-white/90 mb-3 max-w-2xl">
                                {organizer.bio}
                            </p>

                            {/* Stats - Smaller */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start text-xs md:text-sm">
                                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <Ticket className="w-3.5 h-3.5" />
                                    <span className="font-semibold">{organizer.stats.totalRaffles} Rifas</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span className="font-semibold">{organizer.stats.activeRaffles} Activas</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    <Award className="w-3.5 h-3.5" />
                                    <span className="font-semibold">{organizer.stats.totalParticipants}+ Participantes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Raffles Section - Compact */}
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                <div className="mb-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Sorteos Disponibles</h2>
                    <p className="text-sm md:text-base text-gray-600">Selecciona una rifa y participa para ganar increíbles premios</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {activeRaffles.map((raffle) => (
                        <Link key={raffle.id} href={`/${username}/${raffle.id}`} className="group">
                            <Card className="h-full border-2 border-gray-100 hover:border-primary hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Image - Square */}
                                <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:scale-110 transition-transform duration-500"></div>
                                    <Ticket className="w-20 h-20 md:w-24 md:h-24 text-primary/30 relative z-10" />
                                </div>

                                <CardHeader className="pb-2 px-4 pt-4">
                                    <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                                        {raffle.title}
                                    </CardTitle>
                                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                                        {raffle.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="pb-3 px-4">
                                    {/* Progress Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Progreso</span>
                                            <span className="font-semibold text-gray-900">
                                                {raffle.soldTickets}/{raffle.totalTickets}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                                                style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50 border-t pt-3 pb-3 px-4">
                                    <div className="flex items-center justify-between w-full gap-3">
                                        <div className="flex-shrink-0">
                                            <CountdownTimer endDate={raffle.endDate} compact />
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-xl md:text-2xl font-bold text-primary">${raffle.price}</div>
                                            <div className="text-[10px] md:text-xs text-gray-500">por boleto</div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                {activeRaffles.length === 0 && (
                    <div className="text-center py-10">
                        <Ticket className="w-12 h-12 md:w-14 md:h-14 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">No hay rifas activas</h3>
                        <p className="text-sm md:text-base text-gray-600">Vuelve pronto para ver nuevos sorteos</p>
                    </div>
                )}
            </div>

            {/* Social Links Section - Compact */}
            {organizer.socialLinks && (
                <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 border-t">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">Síguenos en Redes Sociales</h3>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {organizer.socialLinks.facebook && (
                            <a
                                href={organizer.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#1877F2] text-white rounded-full hover:bg-[#166FE5] transition-colors shadow-lg text-xs md:text-sm"
                            >
                                <Facebook className="w-4 h-4" />
                                <span className="font-semibold">Facebook</span>
                            </a>
                        )}
                        {organizer.socialLinks.instagram && (
                            <a
                                href={organizer.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg text-xs md:text-sm"
                            >
                                <Instagram className="w-4 h-4" />
                                <span className="font-semibold">Instagram</span>
                            </a>
                        )}
                        {organizer.socialLinks.twitter && (
                            <a
                                href={organizer.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1A91DA] transition-colors shadow-lg text-xs md:text-sm"
                            >
                                <Twitter className="w-4 h-4" />
                                <span className="font-semibold">Twitter</span>
                            </a>
                        )}
                        {organizer.socialLinks.whatsapp && (
                            <a
                                href={`https://wa.me/${organizer.socialLinks.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] transition-colors shadow-lg text-xs md:text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="font-semibold">WhatsApp</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* FAQ Section - Compact */}
            {organizer.faqs && organizer.faqs.length > 0 && (
                <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 border-t">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">Preguntas Frecuentes</h3>
                    <div className="space-y-2.5">
                        {organizer.faqs.map((faq: { question: string; answer: string }, index: number) => (
                            <details
                                key={index}
                                className="group border-2 border-gray-100 rounded-xl overflow-hidden hover:border-primary transition-colors"
                            >
                                <summary className="flex items-center justify-between cursor-pointer p-3.5 md:p-4 bg-white hover:bg-gray-50 transition-colors">
                                    <span className="font-semibold text-gray-900 pr-3 text-sm md:text-base">{faq.question}</span>
                                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="p-3.5 md:p-4 pt-0 bg-gray-50 text-gray-700 leading-relaxed text-sm md:text-base">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <CreateRaffleCTA />

            {/* Footer - Compact */}
            <div className="border-t bg-gray-50 py-4 md:py-5">
                <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
                    <p className="text-xs md:text-sm">
                        Powered by <span className="font-semibold text-primary">NaoLite</span>
                    </p>
                </div>
            </div>

            {/* Floating Admin Button - Only visible to owner */}
            {isOwner && (
                <button
                    id="admin-floating-button"
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-30 group"
                    aria-label="Abrir panel de administración"
                >
                    <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            )}

            {/* Admin Slide Panel */}
            <AdminSlidePanel
                isOpen={isAdminPanelOpen}
                onClose={() => setIsAdminPanelOpen(false)}
            />

            {/* Welcome Tutorial */}
            <WelcomeTutorial
                isActive={showWelcomeTutorial}
                onComplete={handleWelcomeTutorialComplete}
                adminButtonId="admin-floating-button"
            />

            {/* Trust Banner - Fixed Bottom */}
            <div 
                className="fixed bottom-0 left-0 right-0 bg-emerald-50 border-t border-emerald-100 py-2 text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                style={{ 
                    position: 'fixed',
                    zIndex: 9999,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
            >
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    Estos sorteos son seguros
                </div>
            </div>
        </div>
    )
}
