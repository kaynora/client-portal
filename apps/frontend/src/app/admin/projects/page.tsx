'use client'

import Projects from '@/components/dashboard/projects'
import History from '@/components/dashboard/history'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Button, Field, T } from '@kaynora/ui'
import dynamic from 'next/dynamic'

const Modal = dynamic(
  () => import('@kaynora/ui').then(mod => mod.Modal),
  { ssr: false }
)

const ProjectsPage = () => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [failedEmptyTitle, setFailedEmptyTitle] = useState<boolean>(false)
    const [failedServer, setFailedServer] = useState<boolean>(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        if (!data.get('title')) {
            setFailedEmptyTitle(true)
            return
        }

        try {
            const response = await fetch('http://localhost:3000/api/admin/project/create-project', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: data.get('title')
                })
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

            window.location.reload()
        } catch (err) {
            setFailedServer(true)
            console.log(err)
        }
    }

    useEffect(() => {
        setFailedEmptyTitle(false)
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
                <T>New Project</T>
            </Button>

            <Modal isOpen={showModal} onOpenChange={setShowModal}>
                <T weight='500' size='l'>Create New Project</T>
                <form autoComplete='off' onSubmit={handleSubmit} style={{
                    marginTop: '30px',
                    display: 'flex',
                    flexFlow: 'column',
                    gap: '12px',
                    width: '350px',
                }}>
                    <Field
                        disabled={!showModal}
                        label='Title'
                        name='title'
                        errors={[
                            {failState: failedEmptyTitle, message: 'Title field cannot be empty.'},
                            {failState: failedServer, message: 'Something went wrong.'},
                        ]}
                    />

                    <Button width='full' disabled={!showModal} surface='fill'><T>Create Project</T></Button>
                </form>
            </Modal>

            <Projects>Overview</Projects>
            <History>History</History>
        </>
    )
}

export default ProjectsPage
