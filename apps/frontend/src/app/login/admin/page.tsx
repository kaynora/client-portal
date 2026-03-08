'use client'

import { ButtonHTMLAttributes, HTMLAttributes, useState } from 'react'
import styles from './page.module.css'
import Image from 'next/image'
import GlowBackground from '@/components/design/glowBackground'
import { Button, Message, T } from '@kaynora/ui'
import { Alert } from '@kaynora/ui'
import CustomField from '@/components/dashboard/customfield'

const Login = () => {
    const [failedLogin, setFailedLogin] = useState<Boolean>(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/admin/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.get('email'),
                    password: data.get('password')
                })
            })

            if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)
            
            const result = await response.json()
            if (result.redirect) window.location.href = result.redirect
        } catch (err) {
            setFailedLogin(true)
            console.log(err)
        }
    }

    return (
        <div>
            <GlowBackground />

            <div className={styles['auth-sbs']}>
                <div className={styles['logo']}>
                    <Image
                        src='/Logo.svg'
                        alt='Logo'
                        width={300}
                        height={200}
                        priority
                    />
                </div>

                <div className={styles['auth-widget']}>
                    <div className={styles['info']}>
                        <T type='h1' size='s' weight='500'>Welcome back</T>
                        <T color='dimmed'>Sign in with email</T>
                    </div>

                    <form autoComplete='off' onSubmit={handleSubmit} className={styles['auth-form']}>
                        <CustomField label='Email' type='email' name='email' />
                        <CustomField
                            label='Password'
                            name='password'
                            type='password'
                            internal={{
                                button: {
                                    internal: {root: {
                                        type: 'button'
                                    } as React.ButtonHTMLAttributes<HTMLButtonElement>}
                                } as any
                            }}
                        />

                        <button
                            className={styles['login-button']}
                            type='submit'
                        >
                            <T>Sign in</T>
                        </button>

                        <Message
                            isVisible={!!failedLogin}
                            color='error'
                            surface='text'
                        >
                            <Alert />
                            <T size='s' color='error'>Incorrect username or password.</T>
                        </Message>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
