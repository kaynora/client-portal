'use client'

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
    const [clientHeader, setClientHeader] = useState<ClientHeader>()

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
        <div>
            <div style={{marginBottom: '20px'}}>
                <T type='h2' size='s' weight='500' internal={{root: {style: {margin: 0}}}}>Info</T>
                <T color='dimmed'>Client details</T>
            </div>

            <div>
                {clientHeader?.full_name}
            </div>

            <History>History</History>
        </div>
    )
}

export default Client
