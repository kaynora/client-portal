import { Button, Ellipsis, Menu, Popover } from '@kaynora/ui'
import { useState } from 'react'
import styles from './details.module.css'

interface DetailsInterface {
  deleteFile: (fileId: string) => void,
  fileId: string,
}

const Details: React.FC<DetailsInterface> = ({ deleteFile, fileId }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={styles['dropdown-container']}>
      <Button
        surface='text'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowDropdown(true)
        }}
        internal={{root: {
          onBlur: () => setTimeout(() => setShowDropdown(false), 100),
        }}}
      >
        <Ellipsis />
      </Button>

      <Popover
        isOpen={showDropdown}
        internal={{root: {style: {
          position: 'relative'
        }}}}
      >
        <Menu items={[
          {label: 'Delete file', onClick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            deleteFile(fileId)
          }}
        ]} />
      </Popover>
    </div>
  )
}

export default Details
