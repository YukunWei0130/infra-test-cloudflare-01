import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { auth, signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/login')
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">Postcard</Link>
        {auth?.token && (
          <div className="topbar-user">
            <span className="topbar-email">{auth.email}</span>
            <button type="button" className="btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
