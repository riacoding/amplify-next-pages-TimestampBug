import React, { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import useCurrentUser from '@/hooks/useCurrentUser'

const client = generateClient<Schema>()
type PostLike = Schema['PostLikes']['type']
type Props = {}

export default function ClientSide({}: Props) {
  const [postLikes, setPostLikes] = useState<Array<PostLike>>([])
  const user = useCurrentUser()
  useEffect(() => {
    async function fetchPostLikes() {
      if (user) {
        console.log('user: ', user)
        const { data: postLikes, errors } = await client.models.PostLikes.listPostLikesByUserIdAndTimestamp(
          {
            userId: user,
          },
          {
            authMode: 'userPool',
          }
        )
        if (errors) console.log(errors)
        console.log(postLikes)
      }
    }
    fetchPostLikes()
  }, [user])

  return <div>failure - see dev tools</div>
}
