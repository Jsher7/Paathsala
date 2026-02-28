import fetch from 'node-fetch'
import User from '../models/User.js'

const INSTITUTE_DOMAINS = {
  'AOT': 'aot.edu.in',
  'IEM': 'iemcal.com',
  'UIT': 'uit.edu.in',
  'YC': 'yourcollege.edu'
}

const ROLE_IDS = {
  student: 'rol_student',
  teacher: 'rol_teacher',
  admin: 'rol_admin',
  hod: 'rol_hod'
}

export async function provisionUsers({ firstName, lastName, dateOfBirth, batchYear, role, department, instituteCode }) {
  const domain = INSTITUTE_DOMAINS[instituteCode] || process.env.INSTITUTION_DOMAIN || 'college.edu'
  
  const email = generateEmail(firstName, lastName, batchYear, domain)
  const tempPassword = generatePassword(dateOfBirth)
  
  const auth0User = await createAuth0User({
    email,
    password: tempPassword,
    connection: 'Username-Password-Authentication',
    email_verified: false,
    user_metadata: {
      firstName,
      lastName,
      department,
      batch: batchYear,
      role,
      mustChangePassword: true
    }
  })
  
  const user = await User.create({
    auth0Id: auth0User.user_id,
    email,
    name: `${firstName} ${lastName}`,
    role,
    department,
    batch: batchYear,
    passwordChanged: false
  })
  
  await assignRole(auth0User.user_id, role)
  
  await sendCredentialsEmail(email, tempPassword)
  
  return { email, user }
}

function generateEmail(firstName, lastName, batchYear, domain) {
  const namePart = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
  const yearPart = batchYear.toString().slice(-2)
  return `${namePart}.${yearPart}@${domain}`
}

function generatePassword(dateOfBirth) {
  const dob = new Date(dateOfBirth)
  const day = dob.getDate().toString().padStart(2, '0')
  const month = (dob.getMonth() + 1).toString().padStart(2, '0')
  const year = dob.getFullYear().toString()
  return `${day}${month}${year}`
}

async function getManagementToken() {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  })
  
  const data = await response.json()
  if (!data.access_token) {
    throw new Error('Failed to get management token')
  }
  return data.access_token
}

async function createAuth0User(userData) {
  const token = await getManagementToken()
  
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user')
  }
  
  return data
}

async function assignRole(userId, roleName) {
  const token = await getManagementToken()
  const roleId = ROLE_IDS[roleName]
  
  if (!roleId) return
  
  await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ roles: [roleId] })
  })
}

async function sendCredentialsEmail(email, tempPassword) {
  console.log(`[EMAIL] Sending credentials to ${email}`)
  console.log(`[EMAIL] Temporary password: ${tempPassword}`)
  
  // In production, use nodemailer or similar
  // await emailService.send({
  //   to: email,
  //   subject: 'Your College Platform Credentials',
  //   html: `
  //     <h2>Welcome to Smart College Platform!</h2>
  //     <p>Your account has been created.</p>
  //     <p><strong>Email:</strong> ${email}</p>
  //     <p><strong>Temporary Password:</strong> ${tempPassword}</p>
  //     <p>Please change your password after first login.</p>
  //   `
  // })
}

export { generateEmail, generatePassword }
