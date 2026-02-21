import { useEffect, useState } from "react"
import styles from './clients.module.css'
import { Button, Field, T } from "@kaynora/ui"

interface ClientHeader {
    id: string,
    email: string,
    full_name: string
}

const Clients = () => {
    const [clientHeaders, setClientHeaders] = useState<ClientHeader[]>([])
    const [filteredClients, setFilteredClients] = useState<ClientHeader[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getClients = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admin/client/get-client-headers', {
                method: 'GET',
                credentials: 'include'
            })

            const result = await response.json()
            if (result.redirect) {
                window.location.href = result.redirect
            } else {
                setClientHeaders(result)
                setFilteredClients(result)
                setIsLoading(false)
            }
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
        getClients()
    }, [])

    return (
        <div className={styles['client-list']}>
            <div className={styles['header']}>
                <h2>Clients</h2>
                <div className={styles['search-options']}>
                    <Field label='Search' onChange={searchClients} />
                </div>
            </div>

            {filteredClients.length !== 0
                ? filteredClients.map((element, index) => (
                    <Button
                        key={index}
                        href={`/admin/client?client_id=${element.id}`}
                        internal={{root: {draggable: 'false'}}}
                    >
                        <T>{element.full_name}</T>
                        <T>{element.email}</T>
                    </Button>))
                : isLoading
                    ? [...Array(6).keys()].map((value) => (
                        <div key={value} className={styles['skeleton']}></div>))
                    : <span className={styles['empty']}>No clients</span>
            }
        </div>
    )
}

export default Clients
