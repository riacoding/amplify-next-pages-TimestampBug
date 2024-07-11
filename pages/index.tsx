import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateClient } from 'aws-amplify/data'
import { signOut } from 'aws-amplify/auth'
import type { Schema } from '@/amplify/data/resource'
import { Authenticator } from '@aws-amplify/ui-react'
import useCurrentUser from '@/hooks/useCurrentUser'
import '@aws-amplify/ui-react/styles.css'
import { timeDifference } from '@/lib/utils'
import PostDisplay from '@/components/PostDisplay'
import { useRouter } from 'next/router'
import styles from '../styles/home.module.css'

const client = generateClient<Schema>()

type Post = Schema['Post']['type']
export interface PostWithLikes extends Post {
  isLiked?: boolean
  postTime?: string
}

export default function App() {
  const router = useRouter()
  const [posts, setPosts] = useState<Array<PostWithLikes>>([])
  const [postLikes, setPostsLikes] = useState<Set<string> | null>(null)
  const [mergedPosts, setMergedPosts] = useState<PostWithLikes[]>([])
  const user = useCurrentUser()

  //merge posts and likes
  useEffect(() => {
    if (posts.length > 0 && postLikes !== null) {
      const mergedPosts = posts.map((post) => {
        return {
          ...post,
          postTime: timeDifference(post.createdAt),
          isLiked: postLikes !== null ? postLikes.has(post.id) : false,
        }
      })
      setMergedPosts(mergedPosts)
    }
  }, [postLikes, posts])

  useEffect(() => {
    function listPosts() {
      return client.models.Post.observeQuery().subscribe({
        next: ({ items }) => setPosts(items),
      })
    }
    function postLikes() {
      if (user) {
        return client.models.PostLikes.observeQuery({ filter: { userId: { eq: user } } }).subscribe({
          next: (data) => setPostsLikes(new Set(data.items.map((like) => like.postId))),
        })
      } else {
        return null
      }
    }

    let list: any, likes: any
    if (user) {
      list = listPosts()
      likes = postLikes()
    }

    return () => {
      if (user) {
        list.unsubscribe()
        likes?.unsubscribe()
      }
    }
  }, [user])

  function createPost() {
    client.models.Post.create({
      content: window.prompt('Post content'),
    })
  }

  function deletePost(id: string) {
    client.models.Post.delete({ id })
  }

  async function logOut() {
    await signOut()
    //router.reload()
  }

  return (
    <Authenticator>
      {() => (
        <main>
          <h1>My Posts</h1>
          <div className={styles.error}>
            <Link href='/fail'>See Failure page</Link>
          </div>
          <button onClick={createPost}>+ new</button>
          <ul>
            {mergedPosts.map((post) => (
              <PostDisplay key={post.id} post={post} deletePost={deletePost} />
            ))}
          </ul>

          <div>
            🥳 App successfully hosted. Try creating a new Post.
            <br />
            <a href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/'>
              Review next steps of this tutorial.
            </a>
          </div>
          <button onClick={logOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  )
}
