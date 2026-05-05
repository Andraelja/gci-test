'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import api, { apiFetch } from '@/lib/api'
import type { Post } from '@/types'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Loader } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function PostDetail() {
  const params = useParams()
  const postId = params.id as string
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: () => apiFetch<Post>(`/posts/${postId}`),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Link href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const isOwner = post.user_id === user?.id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn btn-ghost">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Posts
        </Link>
        {isOwner && (
          <div className="flex gap-2 ml-auto">
            <Link href="/dashboard" className="btn btn-outline btn-sm">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Link>
            <button 
              className="btn btn-error btn-sm"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <article className="prose prose-headings:text-base-content prose-p:text-base-content/80 max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8 opacity-60">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100">
              <span className="text-lg">{user?.username[0].toUpperCase()}</span>
            </div>
          </div>
          <span>By {user?.name}</span>
          <span>• {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="bg-base-100 p-8 rounded-xl shadow-lg">
          <p className="whitespace-pre-wrap leading-relaxed text-lg">{post.content}</p>
        </div>
      </article>
    </div>
  )
}

