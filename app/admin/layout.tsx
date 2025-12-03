'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    useEffect(() => {
        // Check if user is admin
        const currentUser = localStorage.getItem('currentUser')

        if (!currentUser) {
            router.push('/login')
            return
        }

        const user = JSON.parse(currentUser)

        if (user.role !== 'ADMIN') {
            alert('Acceso denegado. Solo administradores pueden acceder a esta sección.')
            router.push('/')
        }
    }, [router])

    return <>{children}</>
}
