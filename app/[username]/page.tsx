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
            primaryColor: "#1dadfb",
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
                    primaryColor: "#1dadfb",
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
            // Helper for fetch with timeout
            const fetchWithTimeout = async (url: string, timeout = 10000) => {
                const controller = new AbortController()
                const id = setTimeout(() => controller.abort(), timeout)
                try {
                    const response = await fetch(url, {
                        signal: controller.signal,
                        cache: 'no-store',
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    })
                    clearTimeout(id)
                    return response
                } catch (error) {
                    clearTimeout(id)
                    throw error
                }
            }

            // Cargar perfil del organizador con cache-busting
            const cacheBuster = Date.now()
            const profileResponse = await fetchWithTimeout(`/api/user/profile?username=${username}&_=${cacheBuster}`, 10000)

            if (!profileResponse.ok) {
                console.log('Profile not found via API, checking fallback...')
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
            let rafflesData = []
            try {
                const rafflesResponse = await fetchWithTimeout(`/api/user/raffles?username=${username}`)
                if (rafflesResponse.ok) {
                    rafflesData = await rafflesResponse.json()
                }
            } catch (e) {
                console.error('Error fetching raffles:', e)
                // Continue with empty raffles if this fails
            }

            // Calcular estadísticas
            const activeRafflesCount = Array.isArray(rafflesData)
                ? rafflesData.filter((r: any) => r.status === 'ACTIVE').length
                : 0

            const totalParticipants = Array.isArray(rafflesData)
                ? rafflesData.reduce((sum: number, r: any) => sum + r.soldTickets, 0)
                : 0

            setOrganizer({
                id: profileData.id,
                name: profileData.name,
                username: profileData.username,
                bio: profileData.bio || '¡Bienvenido a mi perfil de rifas! Aquí podrás participar en sorteos increíbles.',
                avatarUrl: profileData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`,
                logoData: profileData.logoData,
                bannerData: profileData.bannerData,
                primaryColor: profileData.primaryColor || '#1dadfb',
                stats: {
                    totalRaffles: Array.isArray(rafflesData) ? rafflesData.length : 0,
                    activeRaffles: activeRafflesCount,
                    totalParticipants
                },
                socialLinks: {
                    facebook: profileData.facebook || '',
                    instagram: profileData.instagram || '',
                    twitter: profileData.twitter || '',
                    whatsapp: profileData.whatsapp || profileData.phone || ''
                },
                faqs: profileData.faqs ? JSON.parse(profileData.faqs) : [],
                paymentCards: profileData.paymentCards ? JSON.parse(profileData.paymentCards) : []
            })

            // Convertir rifas al formato esperado
            if (Array.isArray(rafflesData)) {
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
            }
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

    // Inject Custom CSS Variables
    const customStyle = {
        '--primary-custom': organizer.primaryColor,
    } as React.CSSProperties

    return (
        <div className="min-h-screen bg-white" style={customStyle}>
            {/* Hero Section - Custom Banner & Overlay */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: organizer.bannerData
                        ? `url(${organizer.bannerData}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${organizer.primaryColor} 0%, ${organizer.primaryColor}dd 100%)`
                }}
            >
                {/* Overlay for readability if banner exists */}
                {organizer.bannerData && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                )}

                {/* Default pattern if no banner */}
                {!organizer.bannerData && (
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                )}

                <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col items-center text-center text-white space-y-4">
                        {/* Avatar/Logo */}
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1 shadow-2xl overflow-hidden">
                                <img
                                    src={organizer.logoData || organizer.avatarUrl}
                                    alt={organizer.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white text-[var(--primary-custom)] rounded-full p-2 shadow-lg">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">
                                {organizer.name}
                            </h1>
                            <p className="text-base md:text-lg text-white/95 leading-relaxed drop-shadow-sm">
                                {organizer.bio}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-3 justify-center mt-6">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                                    <Ticket className="w-4 h-4" />
                                    <span className="font-semibold text-sm">{organizer.stats.totalRaffles} Rifas</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-semibold text-sm">{organizer.stats.activeRaffles} Activas</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                                    <Award className="w-4 h-4" />
                                    <span className="font-semibold text-sm">{organizer.stats.totalParticipants}+ Participantes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Raffles Section */}
            <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sorteos Disponibles</h2>
                    <p className="text-gray-600">Selecciona una rifa y participa para ganar increíbles premios</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeRaffles.map((raffle) => (
                        <Link key={raffle.id} href={`/${username}/${raffle.id}`} className="group">
                            <Card className="h-full border-2 border-gray-100 hover:border-[var(--primary-custom)] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                                {/* Image Placeholder */}
                                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[var(--primary-custom)]/5 group-hover:scale-110 transition-transform duration-500"></div>
                                    <Ticket className="w-16 h-16 text-[var(--primary-custom)]/30 relative z-10" />

                                    {/* Floating Banner "Desliza" */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--primary-custom)] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
                                        <Ticket className="w-3 h-3" />
                                        Desliza para ver
                                    </div>
                                </div>

                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg group-hover:text-[var(--primary-custom)] transition-colors line-clamp-1">
                                        {raffle.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                                        {raffle.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="pb-4 flex-grow">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-gray-600">Progreso</span>
                                            <span className="text-gray-900">
                                                {raffle.soldTickets}/{raffle.totalTickets}
                                            </span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--primary-custom)] rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50/50 border-t pt-4 pb-4 mt-auto">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                            <div className="p-1 rounded-full bg-blue-50 text-[var(--primary-custom)]">
                                                <CountdownTimer endDate={raffle.endDate} compact />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-[var(--primary-custom)]">
                                                ${raffle.price}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">por boleto</div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                {activeRaffles.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay rifas activas</h3>
                        <p className="text-gray-600">Vuelve pronto para ver nuevos sorteos</p>
                    </div>
                )}
            </div>

            {/* Social Links Section */}
            {organizer.socialLinks && (
                <div className="max-w-5xl mx-auto px-4 py-8 border-t">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Síguenos en Redes Sociales</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {organizer.socialLinks.facebook && (
                            <a
                                href={organizer.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-full hover:bg-[#166FE5] transition-colors shadow-md hover:shadow-lg font-medium"
                            >
                                <Facebook className="w-5 h-5" />
                                Facebook
                            </a>
                        )}
                        {organizer.socialLinks.instagram && (
                            <a
                                href={organizer.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg font-medium"
                            >
                                <Instagram className="w-5 h-5" />
                                Instagram
                            </a>
                        )}
                        {organizer.socialLinks.twitter && (
                            <a
                                href={organizer.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1A91DA] transition-colors shadow-md hover:shadow-lg font-medium"
                            >
                                <Twitter className="w-5 h-5" />
                                Twitter
                            </a>
                        )}
                        {organizer.socialLinks.whatsapp && (
                            <a
                                href={`https://wa.me/${organizer.socialLinks.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] transition-colors shadow-md hover:shadow-lg font-medium"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            {organizer.faqs && organizer.faqs.length > 0 && (
                <div className="max-w-3xl mx-auto px-4 py-10 border-t">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Preguntas Frecuentes</h3>
                    <div className="space-y-3">
                        {organizer.faqs.map((faq: { question: string; answer: string }, index: number) => (
                            <details
                                key={index}
                                className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[var(--primary-custom)] transition-colors bg-white shadow-sm"
                            >
                                <summary className="flex items-center justify-between cursor-pointer p-4 bg-white hover:bg-gray-50 transition-colors list-none">
                                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-transparent group-open:border-gray-100">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <CreateRaffleCTA />

            {/* Footer */}
            <div className="border-t bg-gray-50 py-6">
                <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
                    <p className="text-sm">
                        Powered by <span className="font-bold text-[var(--primary-custom)]">NaoLite</span>
                    </p>
                </div>
            </div>

            {/* Floating Admin Button - Only visible to owner */}
            {isOwner && (
                <button
                    id="admin-floating-button"
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--primary-custom)] text-white rounded-full shadow-2xl hover:brightness-110 hover:scale-110 transition-all duration-300 flex items-center justify-center z-30 group"
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

            {/* Trust Banner - Hidden when admin panel is open */}
            {!isAdminPanelOpen && (
                <div
                    className="bg-emerald-50 border-t border-emerald-200 py-2 px-4"
                    style={{
                        position: 'fixed',
                        zIndex: 30,
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
            )}
        </div>
    )
}
