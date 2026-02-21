import Sidebar from '@/components/dashboard/sidebar'
import { Button, T } from '@kaynora/ui'
import Image from 'next/image'

interface AdminPageProps {
    children: React.ReactNode
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    return (
        <div>
            <Sidebar>
                <Button href='#'>
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Dashboard.svg'
                        alt='(i)'
                    />
                    <T>Dashboard</T>
                </Button>

                <Button href='#'>
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Projects.svg'
                        alt='(i)'
                    />
                    <T>Projects</T>
                </Button>

                <Button href='#'>
                    <Image
                        width={16}
                        height={16}
                        src='/icons/Clients.svg'
                        alt='(i)'
                    />
                    <T>Clients</T>
                </Button>
            </Sidebar>
            {children}
        </div>
    )
}

export default AdminPage
