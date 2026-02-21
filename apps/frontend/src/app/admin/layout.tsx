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
                    surface={isClient && window.location.pathname === '/admin' ? 'fill' : 'hollow'}
                    href='/admin'
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Dashboard.svg'
                        alt='(i)'
                    />
                    <T>Dashboard</T>
                </Button>

                <Button
                    width='full'
                    surface={isClient && window.location.pathname.startsWith('/admin/project') ? 'fill' : 'hollow'}
                    href='/admin/projects'
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Projects.svg'
                        alt='(i)'
                    />
                    <T>Projects</T>
                </Button>

                <Button
                    width='full'
                    surface={isClient && window.location.pathname.startsWith('/admin/client') ? 'fill' : 'hollow'}
                    href='/admin/clients'
                >
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Clients.svg'
                        alt='(i)'
                    />
                    <T>Clients</T>
                </Button>
            </Sidebar>

            <div className={styles['content']}>
                {children}
            </div>
        </div>
    )
}

export default AdminPage
