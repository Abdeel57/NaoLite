"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
                <Card className="border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                    {(footer || onClose) && (
                        <CardFooter className="flex justify-end gap-2">
                            {footer ? footer : (
                                <Button variant="outline" onClick={onClose}>
                                    Cerrar
                                </Button>
                            )}
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>,
        document.body
    )
}
