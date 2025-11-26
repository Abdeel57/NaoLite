"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../components/ui/button"
import { LayoutDashboard, Ticket, User, LogOut, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
        { href: "/dashboard/raffles", label: "Mis Rifas", icon: Ticket },
        { href: "/dashboard/profile", label: "Perfil", icon: User },
    ]

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-background/50 backdrop-blur-xl fixed h-full z-20">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <span>NaoLite</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}>
                                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-30 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" /> NaoLite
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-20 bg-background pt-20 px-4 md:hidden"
                    >
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-4 rounded-xl border",
                                        pathname === item.href
                                            ? "bg-primary/5 border-primary/20 text-primary"
                                            : "bg-card border-border text-muted-foreground"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </div>
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 pt-16 md:pt-0">
                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
