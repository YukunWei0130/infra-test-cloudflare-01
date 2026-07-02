import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { auth } = useAuth()
  return auth?.token ? <Outlet /> : <Navigate to="/login" replace />
}

export function GuestRoute() {
  const { auth } = useAuth()
  return auth?.token ? <Navigate to="/" replace /> : <Outlet />
}
