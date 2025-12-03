"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface TutorialStep {
    id: string
    targetId: string
    title: string
    content: string
    position?: "top" | "bottom" | "left" | "right"
}

interface TutorialContextType {
    activeStep: number
    isTutorialActive: boolean
    steps: TutorialStep[]
    startTutorial: () => void
    endTutorial: () => void
    nextStep: () => void
    skipTutorial: () => void
    registerStep: (step: TutorialStep) => void
    getElementRect: (id: string) => DOMRect | null
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function TutorialProvider({ children, steps: initialSteps = [] }: { children: ReactNode, steps?: TutorialStep[] }) {
    const [activeStep, setActiveStep] = useState(0)
    const [isTutorialActive, setIsTutorialActive] = useState(false)
    const [steps, setSteps] = useState<TutorialStep[]>(initialSteps)

    // Load tutorial state from localStorage on mount
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("hasSeenAdminTutorial")
        if (!hasSeenTutorial) {
            setIsTutorialActive(true)
        }
    }, [])

    const startTutorial = () => {
        setActiveStep(0)
        setIsTutorialActive(true)
    }

    const endTutorial = () => {
        setIsTutorialActive(false)
        localStorage.setItem("hasSeenAdminTutorial", "true")
    }

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1)
        } else {
            endTutorial()
        }
    }

    const skipTutorial = () => {
        endTutorial()
    }

    const registerStep = (step: TutorialStep) => {
        setSteps(prev => {
            if (prev.find(s => s.id === step.id)) return prev
            return [...prev, step]
        })
    }

    const getElementRect = (id: string) => {
        if (typeof document === "undefined") return null
        const element = document.getElementById(id)
        return element ? element.getBoundingClientRect() : null
    }

    return (
        <TutorialContext.Provider value={{
            activeStep,
            isTutorialActive,
            steps,
            startTutorial,
            endTutorial,
            nextStep,
            skipTutorial,
            registerStep,
            getElementRect
        }}>
            {children}
        </TutorialContext.Provider>
    )
}

export function useTutorial() {
    const context = useContext(TutorialContext)
    if (context === undefined) {
        throw new Error("useTutorial must be used within a TutorialProvider")
    }
    return context
}
