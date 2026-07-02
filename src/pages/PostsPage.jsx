import { useCallback, useEffect, useRef, useState } from 'react'
import { createPost, fetchPosts } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function PostsPage() {
  const { auth } = useAuth()
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPosts(auth.token)
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [auth.token])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  function handleImageChange(e) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  function resetForm() {
    setContent('')
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() && !imageFile) return
    setSubmitting(true)
    setError('')
    try {
      await createPost(auth.token, { content: content.trim(), imageFile })
      resetForm()
      await loadPosts()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="posts-page">
      <form onSubmit={handleSubmit} className="post-composer">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected preview" />
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Remove
            </button>
          </div>
        )}
        <div className="composer-actions">
          <label className="btn-ghost file-label">
            📷 Add image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="post-feed">
        {loading && <p className="muted">Loading posts…</p>}
        {!loading && posts.length === 0 && (
          <p className="muted">No posts yet. Be the first to share something!</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            {post.content && <p className="post-content">{post.content}</p>}
            {post.image_url && <img src={post.image_url} alt="" className="post-image" />}
            <time className="post-time">{new Date(post.created_at).toLocaleString()}</time>
          </article>
        ))}
      </div>
    </div>
  )
}
