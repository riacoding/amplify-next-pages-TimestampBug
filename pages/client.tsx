import React, { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import useCurrentUser from '@/hooks/useCurrentUser'

const client = generateClient<Schema>()
type PostLike = Schema['PostLikes']['type']
type Props = {}

const likesQuery = /* GraphQL */ `
  query listPostLikesByUserId($userId: String!, $timestamp: ModelIntKeyConditionInput) {
    listPostLikesByUserIdAndTimestamp(userId: $userId, timestamp: $timestamp) {
      items {
        userId
        postId
        timestamp
        owner
        createdAt
        updatedAt
      }
    }
  }
`

export default function ClientSide({}: Props) {
  const [postLikes, setPostLikes] = useState<Array<PostLike>>([])
  const user = useCurrentUser()
  useEffect(() => {
    async function fetchPostLikes() {
      if (user) {
        const response = await client.graphql({
          query: likesQuery,
          variables: { userId: user, timestamp: { lt: '1720711770556' } },
        })
        console.log(response)
      }
    }
    fetchPostLikes()
  }, [user])

  return <div>client - see dev tools</div>
}
