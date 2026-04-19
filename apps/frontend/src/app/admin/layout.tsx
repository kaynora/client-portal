'use client'

import Image from 'next/image'
import styles from './layout.module.css'
import { Button, Layout, Select, T } from '@kaynora/ui'
import { WebSocketProvider } from '@/utils'

interface AdminPageProps {
    children: any
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    const logOut = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/admin/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })

        const result = await response.json()

        window.location.href = result.redirect
    }

    return (
        <Layout>
            <Layout.TopNav internal={{content: {style: {
                padding: '0 40px'
            }}}}>
                <div className={styles['right']}>
                    <Select
                        name='language'
                        label='Language'
                        value={['en']}
                        // onChange={updateLang}
                        items={[
                        { label: 'EN', value: 'en' },
                        { label: 'FR', value: 'fr' },
                        ]}
                    />
                    <div className={styles['extra']}>
                        <Button
                            surface='hollow'
                        >
                        <Image
                            alt='Notifications'
                            src='/icons/Bell.svg'
                            width={18}
                            height={18}
                            />
                        </Button>

                        <Button
                            surface='hollow'
                        >
                        <Image
                            alt='Settings'
                            src='/icons/Settings.svg'
                            width={18}
                            height={18}
                            />
                        </Button>
                    </div>
                    <button className={styles['user']}>
                        <T size='s'>K. Noraste</T>
                    </button>
                    </div>
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
                                width={18}
                                height={18}
                                src='/icons/Dashboard.svg'
                                alt='(i)'
                            />
                            <T>Home</T>
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
                                width={18}
                                height={18}
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
                                width={18}
                                height={18}
                                src='/icons/Clients.svg'
                                alt='(i)'
                            />
                            <T>Clients</T>
                        </Button>

                        <Button
                            width='full'
                            surface='hollow'
                            size='s'
                            href='/admin/messages'
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
                                width={18}
                                height={18}
                                src='/icons/Chat.svg'
                                alt='(i)'
                            />
                            <T>Messages</T>
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
                            width={18}
                            height={18}
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
