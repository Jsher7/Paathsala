import { useAuth0 } from '@auth0/auth0-react'

function LoginButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  if (isAuthenticated) return null

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="btn-primary px-6 py-3 text-lg"
    >
      Login with College Account
    </button>
  )
}

export default LoginButton
