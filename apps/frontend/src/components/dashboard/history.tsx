import styles from './history.module.css'
import { useEffect, useState } from 'react'
import { Button, T } from '@kaynora/ui'
import CustomField from './customfield'

interface ProjectHistoryHeader {
    id: string,
    title: string,
    updated_at: string,
    created_at: string,
    full_name: string,
    current_status: string
}

const History: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [projectHeaders, setProjectHeaders] = useState<ProjectHistoryHeader[]>([])
    const [filteredHeaders, setFilteredHeaders] = useState<ProjectHistoryHeader[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getProjects = async () => {
        const params = new URLSearchParams(window.location.search)
        const paramClientID = params.get('client_id')

        try {
            const response = await fetch(`http://localhost:3000/api/admin/project/get-project-headers?client_id=${paramClientID}`, {
                method: 'GET',
                credentials: 'include'
            })

            const result = await response.json()

            if (result instanceof Array) {
                result.sort(
                    (a: ProjectHistoryHeader, b: ProjectHistoryHeader) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            }

            if (result.redirect) {
                window.location.href = result.redirect
            } else {
                setProjectHeaders(result)
                setFilteredHeaders(result)
                setIsLoading(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getTimeSince = (timeString: string) => {
        const diff = new Date().getTime() - new Date(timeString).getTime()
        const timeScale: any = [
            ['second', 1000],
            ['minute', 60],
            ['hour', 60],
            ['day', 24],
            ['week', 7],
            ['month', 4.34],
            ['year', 12],
            ['inf', Infinity]
        ]

        let current = 1

        for (let scale of timeScale) {
            current *= scale[1]

            try {
                const next = current * timeScale[timeScale.indexOf(scale) + 1][1]
                if (diff >= current && diff < next) {
                    const result = Math.floor(diff / current)
                    return `${result} ${scale[0]}${result !== 1 ? 's' : ''} ago`
                }
            } catch {
                return 'Just now'
            }
        }
    }

    const searchProjects = (value: string) => {
        let result = []

        for (let item of projectHeaders) {
            if (
                item.title.toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase().trim())
            ) result.push(item)
        }

        setFilteredHeaders(result)
    }

    useEffect(() => {
        getProjects()
    }, [])

    return (
        <div className={styles['projects-history']}>
            <div className={styles['header']}>
                <div style={{marginBottom: '20px'}}>
                    <T type='h2' size='s' weight='500' internal={{root: {style: {margin: 0}}}}>{children}</T>
                    <T color='dimmed'>List of projects</T>
                </div>

                <div className={styles['search-options']}>
                    <CustomField label='Search' onChange={searchProjects} />
                </div>
            </div>

            <div className={styles['projects-list']}>
                {filteredHeaders.length !== 0
                    ? filteredHeaders.map((element, index) => (
                        <Button
                            key={index}
                            href={`/admin/project?project_id=${element.id}`}
                            internal={{root: {draggable: 'false'}}}

                        >
                            <T>{element.title}</T>
                            <div className={styles['details']}>
                                <div className={styles['detail']}>
                                    <T color='dimmed' weight='300' size='s'>Client:</T>
                                    <T size='s'>
                                        {element.full_name !== null
                                            ? element.full_name
                                            : 'Not Assigned'
                                        }
                                    </T>
                                </div>
                                <div className={styles['detail']}>
                                    <T color='dimmed' weight='300' size='s'>Created:</T>
                                    <T size='s'>
                                        {new Date(element.created_at).toLocaleDateString()}
                                    </T>
                                </div>
                                <div className={styles['detail']}>
                                    <T color='dimmed' weight='300' size='s'>Updated:</T>
                                    <T size='s'>
                                        {getTimeSince(element.updated_at)}
                                    </T>
                                </div>
                                <div className={styles['detail']}>
                                    <T color='dimmed' weight='300' size='s'>Status:</T>
                                    <div
                                        className={styles['status']}
                                        style={
                                            element.current_status === 'Cancelled' ?
                                                {backgroundColor: '#262626'} :
                                            element.current_status === 'Paused' ?
                                                {backgroundColor: '#e69a3d'} :
                                            element.current_status === 'In Progress' ?
                                                {backgroundColor: '#667aff'} :
                                            element.current_status === 'Completed' ?
                                                {backgroundColor: '#3da45a'} : {}
                                        }
                                    >
                                        <T color='inverted' weight='500' size='s'>{element.current_status}</T>
                                    </div>
                                </div>
                            </div>
                        </Button>))
                    : isLoading
                        ? [...Array(6).keys()].map((value) => (
                            <div key={value} className={styles['skeleton']}></div>))
                        : <span className={styles['empty']}>No project history</span>
                }
            </div>
        </div>
    )
}

export default History
