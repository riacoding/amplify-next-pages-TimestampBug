import React, { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { useRouter } from 'next/router'
import { Hub } from 'aws-amplify/utils'

export default function useCurrentUser() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)
  useEffect(() => {
    async function getUser() {
      try {
        const { username } = await getCurrentUser()
        setUser(username)
      } catch (err) {
        setUser(null)
      }
    }
    getUser()
    const hubListenerCancel = Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signedIn':
          router.push('/')
          router.reload()
          break
        case 'signedOut':
          break
      }
    })

    return () => hubListenerCancel()
  }, [router])
  return user
}
