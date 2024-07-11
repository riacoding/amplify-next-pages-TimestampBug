import React, { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import useCurrentUser from '@/hooks/useCurrentUser'
import { HeartIcon } from '@/components/icons'
import styles from '../styles/home.module.css'
import { PostWithLikes } from '@/pages'
const client = generateClient<Schema>()

type Props = {
  post: PostWithLikes
  deletePost: (id: string) => void
}

export default function PostDisplay({ post, deletePost }: Props) {
  const [like, setLike] = useState(post.isLiked)
  const user = useCurrentUser()

  async function likePost() {
    console.log('like', post.id, user)
    if (!user) return
    const { data: like, errors } = await client.models.PostLikes.create({
      userId: user,
      postId: post.id,
      timestamp: Date.now(),
    })
    if (errors) console.log(errors)
  }

  function unLikePost() {
    console.log('unlike', post.id)
    if (!user) return
    client.models.PostLikes.delete({
      userId: user,
      postId: post.id,
    })
  }

  function toggleLike() {
    setLike(!like)
    post.isLiked === false ? likePost() : unLikePost()
  }
  return (
    <div className={styles.post} key={post.id}>
      <li onClick={() => deletePost(post.id)} key={post.id}>
        {post.content}
      </li>
      <HeartIcon onClick={toggleLike} className={like === true ? styles.like : styles.unlike} />
    </div>
  )
}
