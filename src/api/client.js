import { API_BASE_URL } from '../config'

async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || 'Registration failed')
  return data
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || 'Login failed')
  return data
}

export async function fetchPosts(token) {
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || 'Failed to load posts')
  return data.posts
}

export async function createPost(token, { content, imageFile }) {
  const formData = new FormData()
  if (content) formData.append('content', content)
  if (imageFile) formData.append('image', imageFile)

  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || 'Failed to create post')
  return data
}
