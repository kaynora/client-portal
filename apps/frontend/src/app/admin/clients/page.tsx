'use client'

import Clients from '@/components/dashboard/clients'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Button, Field, T } from '@kaynora/ui'
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
        if (failedEmptyEmail || failedEmptyName) return

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
            <Button
                onClick={() => setShowModal(true)}
                internal={{root: {style: {
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center',
                    gap: '5px'
                }}}}
            >
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
                <T weight='500' size='l'>Register New Client</T>
                <form autoComplete='off' onSubmit={handleSubmit} style={{
                    marginTop: '30px',
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '12px',
                    width: '350px',
                }}>
                    <Field
                        disabled={!showModal}
                        label='Name'
                        name='name'
                        errors={[
                            {failState: failedEmptyName, message: 'Name field cannot be empty.'},
                        ]}
                    />

                    <Field
                        disabled={!showModal}
                        label='Email'
                        type='email'
                        name='email'
                        errors={[
                            {failState: failedEmptyEmail, message: 'Email field cannot be empty.'},
                            {failState: failedServer, message: 'Something went wrong.'},
                        ]}
                    />

                    <Button width='full' disabled={!showModal} surface='fill'><T>Register Client</T></Button>
                </form>
            </Modal>

            <Clients />
        </>
    )
}

export default ClientsPage
