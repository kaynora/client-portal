'use client'

import { useState } from 'react'
import Projects from '@/components/dashboard/projects'
import Metrics from '@/components/dashboard/metrics'

const AdminPage = () => {
    const [username, setUsername] = useState<string>('User')

    return (
        <>
            {/* <T size='s' type='h1'>Welcome back, {username}!</T> */}
            <Metrics />
            <Projects />
        </>
    )
}

export default AdminPage
