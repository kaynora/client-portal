'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { Button, Layout, T } from '@kaynora/ui'
import { useContext, createContext, useEffect, useState } from 'react'

interface AdminPageProps {
    children: React.ReactElement[]
}

const WebSocketContext = createContext<WebSocket | null>(null)

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider')
    }
    return context
}

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080')
        const message = { type: 'register' }

        ws.addEventListener('open', () => {
            ws.send(JSON.stringify(message))
        })

        setSocket(ws)

        return () => {
            ws.close()
        }
    }, [])

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    )
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const logOut = async () => {
        const response = await fetch('http://localhost:3000/api/admin/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        const result = await response.json()

        window.location.href = result.redirect
    }

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

                        <Button
                            width='full'
                            surface='hollow'
                            size='s'
                            href='/admin/chat'
                            internal={{
                                root: {style: {
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
                                src='/icons/Chat.svg'
                                alt='(i)'
                            />
                            <T>Chat</T>
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
                    <WebSocketProvider>
                        {children}
                    </WebSocketProvider>
                </div>
            </Layout.Content>
        </Layout>
    )
}

export default AdminPage
