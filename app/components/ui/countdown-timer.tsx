"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
    endDate: string
    compact?: boolean
}

export function CountdownTimer({ endDate, compact = false, className = "" }: CountdownTimerProps & { className?: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endDate).getTime() - new Date().getTime()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [endDate])

    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        return (
            <div className={`flex items-center gap-2 text-gray-600 ${className}`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Sorteo finalizado</span>
            </div>
        )
    }

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center gap-1">
            <div className="relative">
                {/* Box container with shadow and gradient */}
                <div className={`bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl p-0.5 shadow-md ${compact ? '' : 'sm:p-1 sm:shadow-xl'}`}>
                    <div className={`bg-gradient-to-b from-white to-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200 ${compact
                            ? 'px-2 py-1.5 min-w-[45px]'
                            : 'px-4 py-3 sm:px-6 sm:py-4 min-w-[70px] sm:min-w-[90px]'
                        }`}>
                        {/* Subtle inner shadow for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100/30 pointer-events-none rounded-lg"></div>

                        {/* Number */}
                        <span className={`font-black text-gray-900 relative z-10 tabular-nums ${compact
                                ? 'text-lg'
                                : 'text-3xl sm:text-5xl'
                            }`}>
                            {String(value).padStart(2, '0')}
                        </span>

                        {/* Flip line effect */}
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-400/40"></div>
                    </div>
                </div>
            </div>

            {/* Label */}
            <span className={`font-bold text-gray-800 uppercase tracking-wider ${compact
                    ? 'text-[9px]'
                    : 'text-xs sm:text-sm'
                }`}>
                {label}
            </span>
        </div>
    )

    return (
        <div className={`flex items-center justify-center ${compact ? 'gap-1.5' : 'gap-2 sm:gap-4'} ${className}`}>
            {timeLeft.days > 0 && <TimeBox value={timeLeft.days} label="Días" />}
            <TimeBox value={timeLeft.hours} label="Horas" />
            <TimeBox value={timeLeft.minutes} label="Minutos" />
            <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>
    )
}
