import api from '../utils/api'

const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your_client_id',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://smart-college-api',
  redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI || 'http://localhost:3000/callback'
}

export function getLoginUrl(examMode = false) {
  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    redirect_uri: authConfig.redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    audience: authConfig.audience,
    ...(examMode && { exam_mode: 'true' })
  })
  
  return `https://${authConfig.domain}/authorize?${params.toString()}`
}

export function getLogoutUrl() {
  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    returnTo: window.location.origin
  })
  
  return `https://${authConfig.domain}/v2/logout?${params.toString()}`
}

export default authConfig
