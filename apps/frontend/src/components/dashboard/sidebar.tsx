'use client'

import { Button, T } from '@kaynora/ui'
import styles from './sidebar.module.css'
import Image from 'next/image'

interface SidebarProps {
    children: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const logOut = async () => {
        const response = await fetch('http://localhost:3000/api/admin/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        const result = await response.json()

        window.location.href = result.redirect
    }

    return (
        <div className={styles['sidebar']}>
            <div className={styles['logo']}>
                <Image
                    width={180}
                    height={80}
                    src={'/Logo.svg'}
                    alt='Logo'
                />
            </div>

            <div className={styles['sidebar-content']}>
                <div className={styles['links']}>
                    {children}
                </div>

                <div className={styles['links']}>
                    <Button
                        width='full'
                        onClick={logOut}
                        internal={{root: {style: { color: '#141414'}}}}
                    >
                        <Image
                            src='/icons/Logout.svg'
                            alt='(i)'
                            width={24}
                            height={24}
                        />
                        <T color='inverted'>Sign Out</T>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
