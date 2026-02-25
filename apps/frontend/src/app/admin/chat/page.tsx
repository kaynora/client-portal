'use client'

import { Button, T } from '@kaynora/ui'
import styles from './page.module.css'
import { getTimeSince } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ChatMessage {
  message_content: string,
  sender_type: string,
  created_at: string,
}

interface ChatHeader extends ChatMessage {
  id: number,
  full_name: string,
}

const Chat = () => {
  const [chatHeaders, setChatHeaders] = useState<ChatHeader[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const getAllChats = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/chat/get-all-chats`, {
        method: 'GET',
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

      if (result.redirect) {
        window.location.href = result.redirect
      } else {
        const sortedResult: ChatHeader[] = result

        sortedResult.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        setChatHeaders(sortedResult)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getChat = async (id: number) => {
    window.history.pushState({}, '', `?client_id=${id}`)

    try {
      const response = await fetch(`http://localhost:3000/api/admin/chat/get-chat-history?client_id=${id}`, {
        method: 'GET',
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

      if (result.redirect) {
        window.location.href = result.redirect
      } else {
        const sortedResult: ChatHeader[] = result

        sortedResult.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })

        setChatMessages(sortedResult)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllChats()

    const id = window.location.href.split('?client_id=')[1]
    if (id) getChat(Number(id))
  }, [])

  return (
    <div className={styles['chat-container']}>
      <div className={styles['sidebar']}>
        {chatHeaders.map((chat, index) => {
          return (
            <Button
              key={index}
              surface='hollow'
              onClick={() => getChat(chat.id)}
            >
              <div className={styles['chat-recipient']}>
                <T>{chat.full_name}</T>
              </div>
              <div className={styles['chat-preview']}>
                <T
                  color='dimmed'
                  size='s'
                  weight='300'
                >{chat.message_content}</T>
              </div>
              <T
                color='dimmed'
                size='xs'
                weight='300'
              >{chat.created_at ? getTimeSince(chat.created_at) : ''}</T>
            </Button>
          )
        })}
      </div>

      <div className={styles['chat']}>
        <div className={styles['history']}>
          {chatMessages.map((message, index) => {
            return (
              <div key={index} className={styles['message']}>
                <div className={styles[`bubble-${message.sender_type}`]}>
                  <T weight='300'>{message.message_content}</T>
                </div>
              </div>
            )
          })}
        </div>
        <form className={styles['message-box']}>
          <input
            className={styles['message-field']}
            type='text'
            placeholder='Message'
          />
          <Button
            surface='hollow'
            internal={{root: {
            }}}
          >
            <Image
                width={16}
                height={16}
                src='/icons/Chat.svg'
                alt='(i)'
            />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Chat
