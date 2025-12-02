"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    ShieldAlert
} from "lucide-react"
import { Button } from "../components/ui/button"

const adminSidebarItems = [
    {
        title: "Resumen Global",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Usuarios",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Suscripciones",
        href: "/admin/subscriptions",
        icon: CreditCard,
    },
    {
        title: "Configuración",
        href: "/admin/settings",
        icon: Settings,
    },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Dark Theme for Super Admin */}
            <aside
                className={`fixed sm:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out sm:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <span className="text-xl font-bold text-white">
                                NaoLite <span className="text-red-500 text-xs uppercase tracking-wider">Admin</span>
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {adminSidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                                            }`}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-white/50" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Admin Profile & Logout */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                                SA
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    Super Admin
                                </p>
                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-red-500" />
                                    Acceso Total
                                </p>
                            </div>
                        </div>
                        <Link href="/" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 border-slate-700 bg-transparent"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Salir del Panel
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="-ml-2"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </Button>
                        <span className="font-semibold text-gray-900">Admin Panel</span>
                    </div>
                </header>

                {/* Desktop Header - Shows on larger screens */}
                <header className="hidden sm:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-30">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Panel de Administración</h2>
                        <p className="text-xs text-gray-500">Gestiona tu plataforma NaoLite</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Super Admin</p>
                            <p className="text-xs text-gray-500">Acceso Total</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                            SA
                        </div>
                    </div>
                </header>


                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    )
}
