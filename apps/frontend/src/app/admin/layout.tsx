'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { Button, Layout, T } from '@kaynora/ui'
import { useEffect, useState } from 'react'

interface AdminPageProps {
    children: React.ReactElement[]
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const [isClient, setIsClient] = useState(false)

    const logOut = async () => {
        const response = await fetch('http://localhost:3000/api/admin/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        const result = await response.json()

        window.location.href = result.redirect
    }

    useEffect(() => setIsClient(true))

    return (
        <Layout>
            <Layout.TopNav>
                <div></div>
            </Layout.TopNav>

            <Layout.SideNav>
                <div className={styles['buttons']}>
                    <div className={styles['nav-group']}>
                        <Button
                            width='full'
                            surface='hollow'
                            size='s'
                            href='/admin'
                            internal={{
                                root: {style: {
                                    color: isClient && window.location.pathname === '/admin' ? '#303030' : '#141414',
                                    display: 'flex',
                                    flexFlow: 'row nowrap',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            }}
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
                            surface='hollow'
                            size='s'
                            href='/admin/projects'
                            internal={{
                                root: {style: {
                                    color: isClient && window.location.pathname.startsWith('/admin/project') ? '#303030' : '#141414',
                                    display: 'flex',
                                    flexFlow: 'row nowrap',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            }}
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
                            surface='hollow'
                            size='s'
                            href='/admin/clients'
                            internal={{
                                root: {style: {
                                    color: isClient && window.location.pathname.startsWith('/admin/client') ? '#303030' : '#141414',
                                    display: 'flex',
                                    flexFlow: 'row nowrap',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                src='/icons/Clients.svg'
                                alt='(i)'
                            />
                            <T>Clients</T>
                        </Button>
                    </div>

                    <Button
                        width='full'
                        size='s'
                        surface='hollow'
                        onClick={logOut}
                        internal={{
                            root: {style: {
                                color: '#141414',
                                display: 'flex',
                                flexFlow: 'row nowrap',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        }}
                    >
                        <Image
                            src='/icons/Logout.svg'
                            alt='(i)'
                            width={24}
                            height={24}
                        />
                        <T>Sign Out</T>
                    </Button>
                </div>
            </Layout.SideNav>

            <Layout.Content>
                <div className={styles['content-wrapper']}>
                    {children}
                </div>
            </Layout.Content>
        </Layout>
    )
}

export default AdminPage
