import type { Metadata } from 'next'
import '@kaynora/ui/dist/index.css'

export const metadata: Metadata = {
    title: 'Client Portal',
    description: 'Custom multi-tenant client portal app',
}

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' data-theme='light'>
        <body>
            {children}
        </body>
        </html>
    )
}
