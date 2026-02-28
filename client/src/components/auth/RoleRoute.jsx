import { useAuth } from '../../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

function RoleRoute({ allowedRoles, children }) {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

export default RoleRoute
