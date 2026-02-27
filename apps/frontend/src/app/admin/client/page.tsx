'use client'

import styles from './page.module.css'
import History from '@/components/dashboard/history'
import { T } from '@kaynora/ui'
import { useEffect, useState } from 'react'

interface ClientHeader {
    id: string,
    email: string,
    full_name: string,
    created_at: string
}

const Client = () => {
    const [clientHeader, setClientHeader] = useState<ClientHeader>({
        id: '',
        email: '',
        full_name: '',
        created_at: '',
    })

    const getClient = async () => {
        const params = new URLSearchParams(window.location.search)
        const paramClientID = params.get('client_id')

        try {
            const response = await fetch(`http://localhost:3000/api/admin/client/get-client?client_id=${paramClientID}`, {
                method: 'GET',
                credentials: 'include'
            })

            const result = await response.json()

            if (result.redirect) {
                window.location.href = result.redirect
            } else {
                setClientHeader(result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getClient()
    }, [])

    return (
        <div className={styles['client-container']}>
            <div className={styles['overview']}>
                <div style={{marginBottom: '20px'}}>
                    <T type='h2' size='s' weight='500' internal={{root: {style: {margin: 0}}}}>Overview</T>
                    <T color='dimmed'>Client details</T>
                </div>

                <div className={styles['details']}>
                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Name:</T>
                        <T weight='500'>{clientHeader.full_name}</T>
                    </div>

                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Email:</T>
                        <T>{clientHeader.email}</T>
                    </div>

                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Joined:</T>
                        <T>{new Date(clientHeader.created_at).toLocaleDateString()}</T>
                    </div>
                </div>
            </div>

            <div className={styles['history-wrapper']}>
                <History>History</History>
            </div>
        </div>
    )
}

export default Client
