"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTutorial } from "./tutorial-context"
import { Button } from "../ui/button"
import { X, ChevronRight, Check } from "lucide-react"

export function TutorialOverlay() {
    const { activeStep, isTutorialActive, steps, nextStep, skipTutorial, getElementRect } = useTutorial()
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    const currentStep = steps[activeStep]

    useEffect(() => {
        if (isTutorialActive && currentStep) {
            const updateRect = () => {
                const rect = getElementRect(currentStep.targetId)
                setTargetRect(rect)
            }

            updateRect()
            window.addEventListener("resize", updateRect)
            window.addEventListener("scroll", updateRect, true)

            // Small delay to ensure DOM is ready if switching tabs
            const timer = setTimeout(updateRect, 100)

            return () => {
                window.removeEventListener("resize", updateRect)
                window.removeEventListener("scroll", updateRect, true)
                clearTimeout(timer)
            }
        }
    }, [isTutorialActive, currentStep, getElementRect])

    if (!isTutorialActive || !currentStep || !targetRect) return null

    // Calculate popover position based on step.position
    const position = currentStep.position || "bottom"
    let popoverStyle: any = {}
    let arrowStyle: any = {}

    const popoverWidth = 300
    const popoverPadding = 20
    const arrowSize = 16
    const isMobile = window.innerWidth < 640 // sm breakpoint

    // On mobile, always use bottom positioning for better UX
    const effectivePosition = isMobile ? "bottom" : position

    switch (effectivePosition) {
        case "left":
            // Check if there's enough space on the left
            const hasSpaceLeft = targetRect.left > popoverWidth + popoverPadding + 20
            if (hasSpaceLeft) {
                popoverStyle = {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.left - popoverWidth - popoverPadding,
                    transform: "translateY(-50%)"
                }
                arrowStyle = {
                    top: "50%",
                    right: -arrowSize / 2,
                    transform: "translateY(-50%) rotate(45deg)",
                    borderRight: "1px solid rgb(243 244 246)",
                    borderBottom: "1px solid rgb(243 244 246)"
                }
            } else {
                // Fallback to bottom if not enough space
                const leftPosition = Math.max(20, Math.min(targetRect.left + targetRect.width / 2 - popoverWidth / 2, window.innerWidth - popoverWidth - 20))
                popoverStyle = {
                    top: targetRect.bottom + popoverPadding,
                    left: leftPosition
                }
                const arrowLeft = targetRect.left + targetRect.width / 2 - leftPosition
                arrowStyle = {
                    top: -arrowSize / 2,
                    left: Math.max(20, Math.min(arrowLeft, popoverWidth - 20)),
                    transform: "rotate(45deg)",
                    borderTop: "1px solid rgb(243 244 246)",
                    borderLeft: "1px solid rgb(243 244 246)"
                }
            }
            break
        case "right":
            // Check if there's enough space on the right
            const hasSpaceRight = (window.innerWidth - targetRect.right) > popoverWidth + popoverPadding + 20
            if (hasSpaceRight) {
                popoverStyle = {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + popoverPadding,
                    transform: "translateY(-50%)"
                }
                arrowStyle = {
                    top: "50%",
                    left: -arrowSize / 2,
                    transform: "translateY(-50%) rotate(45deg)",
                    borderTop: "1px solid rgb(243 244 246)",
                    borderLeft: "1px solid rgb(243 244 246)"
                }
            } else {
                // Fallback to bottom if not enough space
                const leftPosition = Math.max(20, Math.min(targetRect.left + targetRect.width / 2 - popoverWidth / 2, window.innerWidth - popoverWidth - 20))
                popoverStyle = {
                    top: targetRect.bottom + popoverPadding,
                    left: leftPosition
                }
                const arrowLeft = targetRect.left + targetRect.width / 2 - leftPosition
                arrowStyle = {
                    top: -arrowSize / 2,
                    left: Math.max(20, Math.min(arrowLeft, popoverWidth - 20)),
                    transform: "rotate(45deg)",
                    borderTop: "1px solid rgb(243 244 246)",
                    borderLeft: "1px solid rgb(243 244 246)"
                }
            }
            break
        case "top":
            popoverStyle = {
                top: targetRect.top - popoverPadding,
                left: Math.max(20, Math.min(targetRect.left, window.innerWidth - popoverWidth - 20)),
                transform: "translateY(-100%)"
            }
            arrowStyle = {
                bottom: -arrowSize / 2,
                left: Math.min(targetRect.width / 2, popoverWidth / 2),
                transform: "rotate(45deg)",
                borderRight: "1px solid rgb(243 244 246)",
                borderBottom: "1px solid rgb(243 244 246)"
            }
            break
        case "bottom":
        default:
            // Ensure popover stays within viewport and arrow points to target center
            const leftPosition = Math.max(20, Math.min(targetRect.left + targetRect.width / 2 - popoverWidth / 2, window.innerWidth - popoverWidth - 20))
            popoverStyle = {
                top: targetRect.bottom + popoverPadding,
                left: leftPosition
            }
            // Calculate arrow position relative to target center
            const arrowLeft = targetRect.left + targetRect.width / 2 - leftPosition
            arrowStyle = {
                top: -arrowSize / 2,
                left: Math.max(20, Math.min(arrowLeft, popoverWidth - 20)),
                transform: "rotate(45deg)",
                borderTop: "1px solid rgb(243 244 246)",
                borderLeft: "1px solid rgb(243 244 246)"
            }
            break
    }

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
            <AnimatePresence>
                {/* Spotlight Effect */}
                <motion.div
                    key="spotlight"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        x: targetRect.left,
                        y: targetRect.top,
                        width: targetRect.width,
                        height: targetRect.height,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] ring-4 ring-white/50"
                />

                {/* Popover Card */}
                <motion.div
                    key="popover"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        ...popoverStyle
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.1 }}
                    className="absolute pointer-events-auto bg-white rounded-xl shadow-2xl p-5 border border-gray-100"
                    style={{ width: popoverWidth }}
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{currentStep.title}</h3>
                        <button
                            onClick={skipTutorial}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {currentStep.content}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">
                            Paso {activeStep + 1} de {steps.length}
                        </span>
                        <Button
                            onClick={nextStep}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20"
                        >
                            {activeStep === steps.length - 1 ? (
                                <>
                                    Finalizar <Check className="w-3 h-3" />
                                </>
                            ) : (
                                <>
                                    Siguiente <ChevronRight className="w-3 h-3" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Arrow pointing to element */}
                    <div
                        className="absolute w-4 h-4 bg-white"
                        style={arrowStyle}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
