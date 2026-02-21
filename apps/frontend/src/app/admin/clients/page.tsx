'use client'

import Clients from "@/components/dashboard/clients"
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Button, T, Field } from '@kaynora/ui'
import dynamic from 'next/dynamic'

const Modal = dynamic(
  () => import('@kaynora/ui').then(mod => mod.Modal),
  { ssr: false }
)

const ClientsPage = () => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [failedEmptyName, setFailedEmptyName] = useState<boolean>(false)
    const [failedEmptyEmail, setFailedEmptyEmail] = useState<boolean>(false)
    const [failedServer, setFailedServer] = useState<boolean>(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        setFailedEmptyName(!Boolean(data.get('name')))
        setFailedEmptyEmail(!Boolean(data.get('email')))

        if (!Boolean(data.get('name')) || !Boolean(data.get('email'))) return

        try {
            const response = await fetch('http://localhost:3000/api/admin/client/create-client', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_email: data.get('email'),
                    client_name: data.get('name')
                })
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

            window.location.reload()
        } catch (err) {
            console.log(err)
            setFailedServer(true)
        }
    }

    useEffect(() => {
        setFailedEmptyEmail(false)
        setFailedEmptyName(false)
        setFailedServer(false)
    }, [showModal])

    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                <Image
                    src={'/icons/Add.svg'}
                    alt='Add'
                    width={24}
                    height={24}
                />
                <span>
                    New Client
                </span>
            </Button>

            <Modal isOpen={showModal} onOpenChange={setShowModal}>
                <h3>Register New Client</h3>
                <form autoComplete='off' onSubmit={handleSubmit}>
                    <Field disabled={!showModal} label='Name' name='name' />
                    <Field disabled={!showModal} label='Email' type='email' name='email' />

                    <div style={failedServer ? {display: 'block'} : {display: 'none'}}>
                        <p>Something went wrong.</p>
                    </div>

                    <div style={failedEmptyName ? {display: 'block'} : {display: 'none'}}>
                        <p>Please enter a valid name.</p>
                    </div>

                    <div style={failedEmptyEmail ? {display: 'block'} : {display: 'none'}}>
                        <p>Please enter a valid email.</p>
                    </div>

                    <Button disabled={!showModal} surface='fill'><T>Register Client</T></Button>
                </form>
            </Modal>

            <Clients />
        </>
    )
}

export default ClientsPage
