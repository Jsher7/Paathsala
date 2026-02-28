import { expressjwt } from 'express-jwt'
import jwksRsa from 'jwks-rsa'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'your-tenant.auth0.com'
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || 'https://smart-college-api'
const NAMESPACE = 'https://smart-college'

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.auth?.[`${NAMESPACE}/role`]
    
    if (!role) {
      return res.status(403).json({ error: 'No role found in token' })
    }
    
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: role
      })
    }
    
    next()
  }
}

export const getAuth0Id = (req) => {
  return req.auth?.sub
}

export const getRole = (req) => {
  return req.auth?.[`${NAMESPACE}/role`]
}

export const getDepartment = (req) => {
  return req.auth?.[`${NAMESPACE}/department`]
}
