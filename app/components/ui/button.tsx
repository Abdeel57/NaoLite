"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    href?: string
}

const MotionLink = motion(Link)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", href, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg shadow-secondary/20",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        const variantStyles = variants[variant]
        const sizeStyles = sizes[size]

        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(baseStyles, variantStyles, sizeStyles, className)}
                    {...props as any}
                >
                    {props.children}
                </Link>
            )
        }

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(baseStyles, variantStyles, sizeStyles, className)}
                ref={ref}
                {...props as any}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
