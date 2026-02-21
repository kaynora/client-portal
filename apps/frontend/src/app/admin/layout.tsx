'use client'

import Sidebar from '@/components/dashboard/sidebar'
import Image from 'next/image'
import styles from './layout.module.css'
import { Button, T } from '@kaynora/ui'
import { useEffect, useState } from 'react'

interface AdminPageProps {
    children: React.ReactNode
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => setIsClient(true))

    return (
        <div className={styles['dashboard-layout']}>
            <Sidebar>
                <Button
                    width='full'
                    href='/admin'
                    internal={{
                        root: {style: {
                            color: isClient && window.location.pathname === '/admin' ? '#303030' : '#151515'
                        }}
                    }}
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Dashboard.svg'
                        alt='(i)'
                    />
                    <T color='inverted'>Dashboard</T>
                </Button>

                <Button
                    width='full'
                    href='/admin/projects'
                    internal={{
                        root: {style: {
                            color: isClient && window.location.pathname.startsWith('/admin/project') ? '#303030' : '#151515'
                        }}
                    }}
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Projects.svg'
                        alt='(i)'
                    />
                    <T color='inverted'>Projects</T>
                </Button>

                <Button
                    width='full'
                    href='/admin/clients'
                    internal={{
                        root: {style: {
                            color: isClient && window.location.pathname.startsWith('/admin/client') ? '#303030' : '#151515'
                        }}
                    }}
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Clients.svg'
                        alt='(i)'
                    />
                    <T color='inverted'>Clients</T>
                </Button>
            </Sidebar>

            <div className={styles['content']}>
                {children}
            </div>
        </div>
    )
}

export default AdminPage
