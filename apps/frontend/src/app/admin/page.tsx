'use client'

import { T } from '@kaynora/ui'
import { useState } from 'react'
import Projects from '@/components/dashboard/projects'
import Metrics from '@/components/dashboard/metrics'

interface AdminPageProps {
    children: React.ReactNode
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const [username, setUsername] = useState<string>('User')

    return (
        <>
            <T size='s' type='h1'>Welcome back, {username}!</T>
            <Metrics />
            <Projects>Overview</Projects>
        </>
    )
}

export default AdminPage
