import { useEffect, useState } from 'react'
import styles from './metrics.module.css'
import { T } from '@kaynora/ui'

const Metrics = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [fileCount, setFileCount] = useState(0)
  const [filePastCount, setFilePastCount] = useState(0)
  const [clientCount, setClientCount] = useState(0)
  const [clientPastCount, setClientPastCount] = useState(0)
  const [activeProjectCount, setActiveProjectCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)
  const [projectPastCount, setProjectPastCount] = useState(0)

  const getProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/project/get-project-headers`, {
        method: 'GET',
        credentials: 'include'
      })

      const result = await response.json()

      let active = []
      let recent = []
      let past = []

      if (result instanceof Array) {
        active = result.filter(project => {
          return project.current_status === 'In Progress'
        })

        recent = result.filter(project => {
          return new Date(project.created_at) >= new Date(Date.now() - 3600000 * 24 * 30)
        })

        past = result.filter(result => {
          return (
            new Date(result.created_at) >= new Date(Date.now() - 3600000 * 24 * 60) &&
              new Date(result.created_at) < new Date(Date.now() - 3600000 * 24 * 30)
          )
        })
      }

      if (result.redirect) {
        window.location.href = result.redirect
      } else {
        setActiveProjectCount(active.length)
        setProjectCount(recent.length)
        setProjectPastCount(past.length)
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getAllFileHeaders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/project/get-all-file-headers`, {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

      const result = await response.json()

      let recent = []
      let past = []

      if (result instanceof Array) {
        recent = result.filter(file => {
          return new Date(file.created_at) >= new Date(Date.now() - 3600000 * 24 * 30)
        })

        past = result.filter(file => {
          return (
            new Date(file.created_at) >= new Date(Date.now() - 3600000 * 24 * 60) &&
              new Date(file.created_at) < new Date(Date.now() - 3600000 * 24 * 30)
          )
        })
      }

      if (result.redirect) {
        window.location.href = result.redirect
      } else {
        setFileCount(recent.length)
        setFilePastCount(past.length)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getClientHeaders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/client/get-client-headers', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) throw new Error(`Failed to fetch - status: ${response.status}`)

      const result = await response.json()

      let past = []
      let recent = []

      if (result instanceof Array) {
        recent = result.filter(client => {
          return new Date(client.created_at) >= new Date(Date.now() - 3600000 * 24 * 90)
        })

        past = result.filter(client => {
          return (
            new Date(client.created_at) >= new Date(Date.now() - 3600000 * 24 * 180) &&
              new Date(client.created_at) < new Date(Date.now() - 3600000 * 24 * 90)
          )
        })
      }

      if (result.redirect) {
        window.location.href = result.redirect
      } else {
        setClientCount(recent.length)
        setClientPastCount(past.length)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProjects()
    getAllFileHeaders()
    getClientHeaders()
  })

  return (
    <div className={styles['metrics']}>
      <div className={styles['header']}>
        <T type='h2' size='s' weight='500'>Metrics</T>
        <T color='dimmed'>Recent updates</T>
      </div>

      <div className={styles['metrics-container']}>
        {!isLoading ?
          <>
            <div className={styles['metric']}>
              <div>
                <T type='h2' size='xs' weight='400'>Current projects</T>
                <T color='dimmed' size='s' weight='300'>Active workload</T>
              </div>
              <T weight='400' internal={{root: {style: {fontSize: '2.5rem'}}}}>{activeProjectCount}</T>
            </div>

            <div className={styles['metric']}>
              <div>
                <T type='h2' size='xs' weight='400'>Projects started</T>
                <T color='dimmed' size='s' weight='300'>Past 30 days</T>
              </div>
              <T weight='400' internal={{root: {style: {fontSize: '2.5rem'}}}}>{projectCount}</T>
              <T weight='300' size='s' color='dimmed'>
                {
                  (projectCount > projectPastCount ? '+' : '-') +
                    Math.abs(projectPastCount - projectCount) + ' from last month'
                }
              </T>
            </div>

            <div className={styles['metric']}>
              <div>
                <T type='h2' size='xs' weight='400'>Documents shared</T>
                <T color='dimmed' size='s' weight='300'>Past 30 days</T>
              </div>
              <T weight='400' internal={{root: {style: {fontSize: '2.5rem'}}}}>{fileCount}</T>
              <T weight='300' size='s' color='dimmed'>
                {
                  (fileCount > filePastCount ? '+' : '-') +
                    Math.abs(filePastCount - fileCount) + ' from last month'
                }
              </T>
            </div>

            <div className={styles['metric']}>
              <div>
                <T type='h2' size='xs' weight='400'>New clients</T>
                <T color='dimmed' size='s' weight='300'>Past 90 days</T>
              </div>
              <T weight='400' internal={{root: {style: {fontSize: '2.5rem'}}}}>{clientCount}</T>
              <T weight='300' size='s' color='dimmed'>
                {
                  clientCount === clientPastCount ? 'Same as last quarter' :
                  ((clientCount > clientPastCount ? '+' : '-') +
                    Math.abs(clientPastCount - clientCount) + ' from last quarter')
                }
              </T>
            </div>
          </>

        : [...Array(4).keys()].map((value) => (
          <div key={value} className={styles['skeleton']}></div>))
        }
      </div>
    </div>
  )
}

export default Metrics
