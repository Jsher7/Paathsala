import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const {
    isAuthenticated,
    user: auth0User,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout
  } = useAuth0()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://smart-college-api'
            }
          })
          localStorage.setItem('token', token)

          const response = await api.get('/auth/me')
          setUser(response.data.user)
          setRole(response.data.user.role)
          setDepartment(response.data.user.department)
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          setLoading(false)
        }
      } else if (!isLoading) {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  const value = {
    user,
    role,
    department,
    isAuthenticated,
    isLoading: isLoading || loading,
    loginWithRedirect,
    logout: () => {
      localStorage.removeItem('token')
      logout({ logoutParams: { returnTo: window.location.origin } })
    },
    getAccessTokenSilently
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}