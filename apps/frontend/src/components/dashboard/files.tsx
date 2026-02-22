import { useEffect, useState } from 'react'
import styles from './files.module.css'
import { Button, DropdownMenu, Ellipsis, Message, Popover, T } from '@kaynora/ui'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Details from './details'

const Modal = dynamic(
  () => import('@kaynora/ui').then(mod => mod.Modal),
  { ssr: false }
)

interface FileHeader {
    id: string,
    file_name: string,
    file_type: string,
    size_bytes: number
    created_at: string
}

const Files = () => {
    const [fileHeaders, setFileHeaders] = useState<FileHeader[]>([])
    const [showModal, setShowModal] = useState(false)
    const [isDraggedOver, setIsDraggedOver] = useState(false)
    const [fileCountError, setFileCountError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const getFileHeaders = async () => {
        const params = new URLSearchParams(window.location.search)
        const paramProjectID = params.get('project_id')

        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/get-file-headers?project_id=${paramProjectID}`, {
                method: 'GET',
                credentials: 'include'
            })

            const result = await response.json()
            if (result.redirect) {
                window.location.href = result.redirect
            } else {
                setFileHeaders(result)
                setIsLoading(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const uploadFile = async (file: File) => {
        const params = new URLSearchParams(window.location.search)
        const paramProjectID = params.get('project_id')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(`http://localhost:3000/api/admin/project/upload-file?project_id=${paramProjectID}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            setShowModal(false)
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    const deleteFile = async (id: string) => {
        const params = new URLSearchParams(window.location.search)
        const paramProjectID = params.get('project_id')

        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/delete-file?project_id=${paramProjectID}&file_id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getFileHeaders()
    }, [])

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDraggedOver(false)
        setFileCountError(false)

        if (e.dataTransfer.files.length < 1) return
        else if (e.dataTransfer.files.length > 1) {
            setFileCountError(true)
            return
        }

        uploadFile(e.dataTransfer.files[0])
    }

    return (
        <div className={styles['files']}>
            <div style={{marginBottom: '20px'}}>
                <T type='h2' size='s' weight='500' internal={{root: {style: {margin: 0}}}}>Uploads</T>
                <T color='dimmed'>Shared files</T>
            </div>

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
                <T>Upload File</T>
            </Button>

            <Modal isOpen={showModal} onOpenChange={(value) => {setFileCountError(false); setShowModal(value)}}>
                <div className={styles['modal-content']}>
                    <T weight='500' size='l'>Share a File With the Client</T>

                    <div
                        className={styles['drop-zone']}
                        onDragOver={(e) => {e.preventDefault(); setIsDraggedOver(true)}}
                        onDragLeave={() => setIsDraggedOver(false)}
                        onDrop={handleDrop}
                        style={{
                            borderColor: isDraggedOver ? 'var(--accent)' : 'var(--gray-3)',
                        }}
                    >
                        <T
                            color='disabled'
                            size='xl'
                            internal={{root: {style: {
                                pointerEvents: 'none',
                            }}}}
                        >{isDraggedOver ? 'Release to upload' : 'Drag & drop file here'}</T>
                    </div>

                    <Message color='error' isVisible={fileCountError}><T>Only one file can be uploaded at a time.</T></Message>
                </div>
            </Modal>

            <div className={styles['file-list']}>
                {fileHeaders.length !== 0
                    ? fileHeaders?.map((file, index) => (
                        <Button
                            key={index}
                            href='#'
                            internal={{root: {style: {
                                width: '30%',
                                minWidth: '250px',
                            }}}}
                        >
                            <div className={styles['file']}>
                                <div className={styles['header']}>
                                    <T>{file.file_name}</T>
                                    <Details deleteFile={deleteFile} fileId={file.id} />
                                </div>
                                <div className={styles['date']}>
                                    <T size='s' weight='300' color='dimmed'>Uploaded: </T>
                                    <T size='s'>{new Date(file.created_at).toLocaleDateString()}</T>
                                </div>
                            </div></Button>
                    ))

                    : isLoading
                        ? [...Array(6).keys()].map((value) => (
                            <div key={value} className={styles['skeleton']}></div>))
                        : <span className={styles['empty']}>No files</span>
                }
            </div>
        </div>
    )
}

export default Files
