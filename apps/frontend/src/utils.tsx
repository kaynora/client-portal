'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const WebSocketContext = createContext<WebSocket | null>(null)

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider')
    }
    return context
}

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080')
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ type: 'register' }))
        })
        setSocket(ws)
        return () => ws.close()
    }, [])

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const getTimeSince = (timeString: string) => {
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
