'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { Button } from '../components/ui/button'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user is admin
        const currentUser = localStorage.getItem('currentUser')

        if (!currentUser) {
            router.push('/login')
            return
        }

        const user = JSON.parse(currentUser)

        if (user.role !== 'ADMIN') {
            alert('Acceso denegado. Solo administradores pueden acceder a esta sección.')
            router.push('/')
            return
        }

        setIsLoading(false)
    }, [router])

    const menuItems = [
        {
            title: "Resumen",
            href: "/admin",
            icon: LayoutDashboard
        },
        {
            title: "Usuarios",
            href: "/admin/users",
            icon: Users
        },
        {
            title: "Configuración",
            href: "/admin/config",
            icon: Settings
        }
    ]

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        router.push('/login')
    }

    if (isLoading) {
        return null // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/naolite-logo-white.png"
                                    alt="NaoLite"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight">NaoLite</span>
                        </div>
                        <button
                            className="ml-auto lg:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }
                                    `}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                                SA
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Super Admin</p>
                                <p className="text-xs text-slate-400">admin@naolite.com</p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full justify-start gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-none"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b flex items-center px-4 lg:hidden sticky top-0 z-30">
                    <button
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-semibold text-gray-900">Panel de Administración</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
