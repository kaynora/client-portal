'use client'

import Projects from '@/components/dashboard/projects'
import { T } from '@kaynora/ui'
import { useState } from 'react'

interface AdminPageProps {
    children: React.ReactNode
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const [username, setUsername] = useState<string>('User')

    return (
        <>
            <T type='h1'>Welcome back, {username}!</T>
            <Projects>Overview</Projects>
        </>
    )
}

export default AdminPage
