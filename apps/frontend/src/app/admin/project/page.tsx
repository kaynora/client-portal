'use client'

import Files from '@/components/dashboard/files'
import Dropdown from '@/components/dashboard/dropdown'
import Image from 'next/image'
import styles from './page.module.css'
import { getTimeSince } from '@/utils'
import { useEffect, useState } from 'react'

import { Button, Field, T } from '@kaynora/ui'
import dynamic from 'next/dynamic'

const Modal = dynamic(
  () => import('@kaynora/ui').then(mod => mod.Modal),
  { ssr: false }
)

interface ProjectHeader {
    id: string,
    full_name: string | null,
    client_id: string,
    title: string,
    current_status: string,
    updated_at: string,
    created_at: string
}

interface ClientHeader {
    id: string,
    email: string,
    full_name: string
}

const ProjectPage = () => {
    const [showClientModal, setShowClientModal] = useState<boolean>(false)
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false)

    const [fetchedClients, setFetchedClients] = useState<boolean>(false)
    const [clientHeaders, setClientHeaders] = useState<ClientHeader[]>([])
    const [filteredClients, setFilteredClients] = useState<ClientHeader[]>([])

    const [projectHeader, setProjectHeader] = useState<ProjectHeader>({
        id: '',
        full_name: null,
        title: '',
        client_id: '',
        current_status: '',
        updated_at: '',
        created_at: ''
    })

    const getProject = async (paramProjectID: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/get-project?project_id=${paramProjectID}`, {
                method: 'GET',
                credentials: 'include'
            })

            const result = await response.json()

            if (result.redirect) {
                window.location.href = result.redirect
            } else {
                setProjectHeader(result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getClients = async () => {
        try {
            if (fetchedClients) return

            const response = await fetch('http://localhost:3000/api/admin/client/get-client-headers', {
                method: 'GET',
                credentials: 'include'
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

            const result = await response.json()
            setClientHeaders(result)
            setFilteredClients(result)
            setFetchedClients(true)
        } catch (err) {
            console.log(err)
        }
    }

    const assignClient = async (event: React.MouseEvent) => {
        const params = new URLSearchParams(window.location.search)
        const paramsProjectID = params.get('project_id')
        console.log(event.currentTarget)

        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/assign-client?project_id=${paramsProjectID}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: event.currentTarget.querySelector('div')!.getAttribute('data-id')
                })
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    const setStatus = async (status: string) => {
        const params = new URLSearchParams(window.location.search)
        const paramsProjectID = params.get('project_id')

        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/set-project-status?project_id=${paramsProjectID}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status
                })
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    const searchClients = (value: string) => {
        let result = []

        for (let item of clientHeaders) {
            const normalizedValue = value.toLocaleLowerCase().trim()
            if (
                item.full_name.toLocaleLowerCase()
                    .includes(normalizedValue)

                ||

                item.email
                    .includes(normalizedValue)
            ) result.push(item)
        }

        setFilteredClients(result)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const paramProjectID = params.get('project_id')
        if (paramProjectID) {
            getProject(paramProjectID)
        } else {
            window.location.href = '/admin/projects'
        }
    }, [])

    return (
        <div className={styles['project-container']}>
            <div className={styles['overview']}>
                <div style={{marginBottom: '20px'}}>
                    <T type='h2' size='s' weight='500' internal={{root: {style: {margin: 0}}}}>Overview</T>
                    <T color='dimmed'>Project details</T>
                </div>

                <div className={styles['detail']}>
                    <T weight='300' color='dimmed'>Title:</T>
                    <T weight='500'>{projectHeader.title}</T>
                </div>

                <div className={styles['details']}>
                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Status:</T>
                        <div className='status-container'>
                            <Button
                                size='s'
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                internal={{root: {style: {
                                    display: 'flex',
                                    flexFlow: 'row nowrap',
                                    gap: '5px',
                                    alignItems: 'center',
                                    borderColor: 'currentColor',
                                    backgroundColor: 'currentColor',
                                    color:
                                        projectHeader.current_status === 'Cancelled' ?
                                            '#262626' :
                                        projectHeader.current_status === 'Paused' ?
                                            '#e69a3d' :
                                        projectHeader.current_status === 'In Progress' ?
                                            '#667aff' :
                                        projectHeader.current_status === 'Completed' ?
                                            '#3da45a' : '#fff'
                                }}}}
                            >
                                <T color='inverted' weight='500'>{projectHeader.current_status}</T>
                                <Image
                                    src={'/icons/Edit.svg'}
                                    alt='change status'
                                    width={18}
                                    height={18}
                                />
                            </Button>

                            <Dropdown showDropdown={showStatusDropdown} setShowDropdown={setShowStatusDropdown}>
                                <div className={styles['status']}>
                                    <div className={styles['status-list']}>
                                        <Button
                                            width='full'
                                            surface='hollow'
                                            onClick={() => setStatus('Cancelled')}
                                            disabled={!showStatusDropdown}
                                        >
                                            <svg
                                                height='20'
                                                width='20'
                                                className={styles['cancelled']}
                                            >
                                                <circle r="4" cx="10" cy="10" />
                                            </svg>
                                            <span>Cancelled</span>
                                        </Button>

                                        <Button
                                            width='full'
                                            surface='hollow'
                                            onClick={() => setStatus('Paused')}
                                            disabled={!showStatusDropdown}
                                        >
                                            <svg
                                                height='20'
                                                width='20'
                                                className={styles['paused']}
                                            >
                                                <circle r="4" cx="10" cy="10" />
                                            </svg>
                                            <span>Paused</span>
                                        </Button>

                                        <Button
                                            width='full'
                                            surface='hollow'
                                            onClick={() => setStatus('In Progress')}
                                            disabled={!showStatusDropdown}
                                        >
                                            <svg
                                                height='20'
                                                width='20'
                                                className={styles['in-progress']}
                                            >
                                                <circle r="4" cx="10" cy="10" />
                                            </svg>
                                            <span>In Progress</span>
                                        </Button>

                                        <Button
                                            width='full'
                                            surface='hollow'
                                            onClick={() => setStatus('Completed')}
                                            disabled={!showStatusDropdown}
                                        >
                                            <svg
                                                height='20'
                                                width='20'
                                                className={styles['completed']}
                                            >
                                                <circle r="4" cx="10" cy="10" />
                                            </svg>
                                            <span>Completed</span>
                                        </Button>
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Client:</T>
                        <div className={styles['name']}>
                            {projectHeader.full_name !== null
                                ?
                                    <div className={styles['client']}>
                                        <Button
                                            surface='text'
                                            href={`/admin/client?client_id=${projectHeader.client_id}`}
                                        >
                                            <T weight='500'>{projectHeader.full_name}</T>
                                        </Button>
                                    </div>
                                :
                                    <Button size='s' onClick={() => {
                                        getClients()
                                        setShowClientModal(true)
                                    }}>
                                        <T>Assign a Client</T>
                                    </Button>
                            }
                        </div>
                    </div>

                    <Modal isOpen={showClientModal} onOpenChange={setShowClientModal}>
                        <div className={styles['items']}>
                            <div className={styles['header']}>
                                <T size='l' weight='500'>Assign a Client to This Project</T>
                                <div className={styles['search-options']}>
                                    <Field label='Search' onChange={searchClients} />
                                </div>
                            </div>

                            <div className={styles['item-list']}>
                                {filteredClients.map((element, index) => (
                                    <Button
                                        width='full'
                                        onClick={assignClient}
                                        key={index}
                                        internal={{root: { style: {
                                            display: 'flex',
                                            flexFlow: 'row nowrap',
                                            justifyContent: 'space-between'
                                        }}}}
                                    >
                                        <div data-id={element.id} style={{display: 'none'}}></div>
                                        <T>{element.full_name}</T>
                                        <T>{element.email}</T>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Modal>

                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Updated:</T>
                        <T>{getTimeSince(projectHeader.updated_at)}</T>
                    </div>

                    <div className={styles['detail']}>
                        <T weight='300' color='dimmed'>Created:</T>
                        <T>{new Date(projectHeader.created_at).toLocaleDateString()}</T>
                    </div>
                </div>
            </div>

            <div className={styles['files-wrapper']}>
                <Files />
            </div>
        </div>
    )
}

export default ProjectPage
