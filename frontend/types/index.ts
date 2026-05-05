export interface User {
  id: number
  name: string
  username: string
}

export interface Post {
  id: number
  title: string
  content: string
  user_id: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  message: string
  data: T
}

