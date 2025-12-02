"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Palette,
    Calendar,
    TrendingUp,
    Ticket,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight
} from "lucide-react"
import { Button } from "../components/ui/button"

const sidebarItems = [
    {
        title: "Resumen",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Personalizar",
        href: "/dashboard/customize",
        icon: Palette,
    },
    {
        title: "Apartados",
        href: "/dashboard/reservations",
        icon: Calendar,
    },
    {
        title: "Ventas",
        href: "/dashboard/sales",
        icon: TrendingUp,
    },
    {
        title: "Rifas",
        href: "/dashboard/raffles",
        icon: Ticket,
    },
    {
        title: "Usuario",
        href: "/dashboard/user",
        icon: User,
    },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                                N
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                NaoLite
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                            }`}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-primary" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                CD
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    Club Deportivo
                                </p>
                                <p className="text-xs text-gray-500 truncate">Plan Pro</p>
                            </div>
                        </div>
                        <Link href="/" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar Sesión
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:hidden sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="-ml-2"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </Button>
                        <span className="font-semibold text-gray-900">Dashboard</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        CD
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    )
}
