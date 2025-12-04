"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    username: string
    name: string
    email: string
    role: string
    plan: string
    isFirstTimeUser: boolean
}

interface AuthContextType {
    currentUser: User | null
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
    signup: (userData: { name: string; email: string; username: string; password: string; phone?: string }) => Promise<boolean>
    selectPlan: (plan: string) => void
    markTutorialComplete: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const router = useRouter()

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser))
        }
    }, [])

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'Error al iniciar sesión')
                return false
            }

            const data = await response.json()
            const user: User = {
                ...data.user,
                isFirstTimeUser: false
            }

            setCurrentUser(user)
            localStorage.setItem("currentUser", JSON.stringify(user))
            return true
        } catch (error) {
            console.error('Login error:', error)
            alert('Error al iniciar sesión')
            return false
        }
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem("currentUser")
        router.push("/")
    }

    const signup = async (userData: { name: string; email: string; username: string; password: string; phone?: string }): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error || 'Error al registrarse')
                return false
            }

            const data = await response.json()
            const user: User = {
                ...data.user,
                isFirstTimeUser: true
            }

            setCurrentUser(user)
            localStorage.setItem("currentUser", JSON.stringify(user))
            return true
        } catch (error) {
            console.error('Signup error:', error)
            alert('Error al registrarse')
            return false
        }
    }

    const selectPlan = (plan: string) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, plan }
            setCurrentUser(updatedUser)
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        }
    }

    const markTutorialComplete = () => {
        if (currentUser) {
            const updatedUser = { ...currentUser, isFirstTimeUser: false }
            setCurrentUser(updatedUser)
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        }
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated: !!currentUser,
            login,
            logout,
            signup,
            selectPlan,
            markTutorialComplete
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
