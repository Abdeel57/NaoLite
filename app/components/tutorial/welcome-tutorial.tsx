"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"

interface WelcomeTutorialProps {
    isActive: boolean
    onComplete: () => void
    adminButtonId: string
}

export function WelcomeTutorial({ isActive, onComplete, adminButtonId }: WelcomeTutorialProps) {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        if (isActive) {
            const updateRect = () => {
                const element = document.getElementById(adminButtonId)
                if (element) {
                    setTargetRect(element.getBoundingClientRect())
                }
            }

            updateRect()
            window.addEventListener("resize", updateRect)
            window.addEventListener("scroll", updateRect, true)

            const timer = setTimeout(updateRect, 100)

            return () => {
                window.removeEventListener("resize", updateRect)
                window.removeEventListener("scroll", updateRect, true)
                clearTimeout(timer)
            }
        }
    }, [isActive, adminButtonId])

    if (!isActive || !targetRect) return null

    // Position popover above the button
    const popoverWidth = 320
    const popoverPadding = 20
    const arrowSize = 16

    const popoverStyle = {
        bottom: window.innerHeight - targetRect.top + popoverPadding,
        left: Math.max(20, Math.min(targetRect.left + targetRect.width / 2 - popoverWidth / 2, window.innerWidth - popoverWidth - 20))
    }

    const arrowLeft = targetRect.left + targetRect.width / 2 - popoverStyle.left

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
            <AnimatePresence>
                {/* Backdrop */}
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 pointer-events-auto"
                />

                {/* Spotlight on admin button */}
                <motion.div
                    key="spotlight"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: targetRect.left,
                        y: targetRect.top,
                        width: targetRect.width,
                        height: targetRect.height,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-primary/50"
                />

                {/* Welcome Popover */}
                <motion.div
                    key="popover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        ...popoverStyle
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                    className="absolute pointer-events-auto bg-white rounded-xl shadow-2xl p-6 border border-gray-100"
                    style={{ width: popoverWidth }}
                >
                    <div className="mb-4">
                        <h2 className="font-bold text-2xl text-gray-900 mb-2">
                            ¡Bienvenido! 🎉
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Este es tu <span className="font-semibold text-primary">Panel de Administrador</span>.
                            Desde aquí podrás gestionar tus rifas, ver ventas y personalizar tu perfil.
                        </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            💡 <span className="font-semibold">Tip:</span> Haz clic en el botón de abajo para abrir el administrador.
                        </p>
                    </div>

                    <Button
                        onClick={onComplete}
                        className="w-full bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20"
                    >
                        Comenzar Tutorial <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Arrow pointing down to button */}
                    <div
                        className="absolute w-4 h-4 bg-white"
                        style={{
                            bottom: -arrowSize / 2,
                            left: Math.max(20, Math.min(arrowLeft, popoverWidth - 20)),
                            transform: "rotate(45deg)",
                            borderRight: "1px solid rgb(243 244 246)",
                            borderBottom: "1px solid rgb(243 244 246)"
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
