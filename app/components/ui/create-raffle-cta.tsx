"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Check } from "lucide-react"

export function CreateRaffleCTA() {
    return (
        <div className="border-t bg-gray-50 py-6">
            <div className="max-w-4xl mx-auto px-4 flex justify-center">
                <details className="group w-full md:w-auto">
                    <summary className="cursor-pointer list-none flex justify-center">
                        <div className="bg-white border border-primary/30 text-primary px-4 py-2 rounded-full hover:bg-primary/5 transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-sm">
                            <span>¿Quieres organizar tu propia rifa?</span>
                            <svg
                                className="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </summary>

                    {/* Expanded Content - Simplified */}
                    <div className="mt-4 animate-in slide-in-from-top-2 duration-300 max-w-lg mx-auto">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6 text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Organiza sorteos profesionales con NaoLite
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                La forma más fácil, segura y confiable de crear rifas digitales.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm text-gray-700">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Rápido</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Seguro</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-1">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Confiable</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link href="/" className="w-full">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                                        Crear mi primera rifa
                                    </Button>
                                </Link>
                                <Link href="/" className="text-xs text-gray-500 hover:text-primary transition-colors">
                                    Más información sobre NaoLite
                                </Link>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    )
}
