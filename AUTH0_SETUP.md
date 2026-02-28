# Auth0 Setup Guide

This guide walks you through setting up Auth0 for the Smart College Platform.

## 1. Create Auth0 Account

1. Go to [auth0.com](https://auth0.com) and sign up for a free account
2. Create a new tenant (e.g., `smart-college`)

## 2. Create Applications

### Single Page Application (Frontend)

1. Go to **Applications > Applications**
2. Click **Create Application**
3. Name: `Smart College - Frontend`
4. Type: **Single Page Application**
5. Settings:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
   - Copy **Client ID** to `client/.env` as `VITE_AUTH0_CLIENT_ID`

### Machine-to-Machine Application (Backend)

1. Click **Create Application**
2. Name: `Smart College - Backend`
3. Type: **Machine to Machine**
4. Select the API you'll create in step 3

## 3. Create API

1. Go to **Applications > APIs**
2. Click **Create API**
3. Settings:
   - **Name**: `Smart College API`
   - **Identifier**: `https://smart-college-api` (use this as audience)
   - **Signing Algorithm**: RS256
4. Copy **Identifier** to both `.env` files as `AUTH0_AUDIENCE`

## 4. Configure Roles (RBAC)

1. Go to **User Management > Roles**
2. Create roles:
   - **student** - Description: Student access
   - **teacher** - Description: Teacher access
   - **admin** - Description: Administrator access
   - **hod** - Description: Head of Department access

### Add Permissions

1. Go to **Applications > APIs > Smart College API > Permissions**
2. Add permissions:
   - `read:routine` - View class routine
   - `write:routine` - Manage routine
   - `read:exams` - View exams
   - `write:exams` - Create/manage exams
   - `read:labs` - View lab assignments
   - `submit:labs` - Submit lab work
   - `read:library` - Access library
   - `write:library` - Upload to library
   - `admin:users` - Manage users
   - `admin:all` - Full admin access

### Assign Permissions to Roles

1. Edit each role and add appropriate permissions:
   - **student**: `read:routine`, `read:exams`, `read:labs`, `submit:labs`, `read:library`
   - **teacher**: All student permissions + `write:routine`, `write:exams`, `write:library`
   - **admin**: All permissions + `admin:users`, `admin:all`

## 5. Enable RBAC

1. Go to **Applications > APIs > Smart College API > Settings**
2. Enable:
   - **RBAC Settings**: Toggle ON
   - **Add Permissions in the Access Token**: Toggle ON

## 6. Configure Connections

### Database Connection

1. Go to **Authentication > Database**
2. Create new connection or use default `Username-Password-Authentication`
3. Settings:
   - **Password Policy**: Good or Excellent
   - **Password History**: Enable
   - **Email Verification**: Optional (since college emails are pre-verified)

### Social Connections (Optional)

1. Go to **Authentication > Social**
2. Enable **Google**:
   - Create Google OAuth credentials
   - Add Client ID and Secret
3. Enable **GitHub** (optional)

## 7. Configure MFA

1. Go to **Security > Multi-factor Auth**
2. Enable factors:
   - **Push Notification** (via Auth0 Guardian app)
   - **One-time Password** (via authenticator apps)
3. Enable **Adaptive MFA** (Enterprise feature, optional)

## 8. Install Actions

### Post-Login Action

1. Go to **Actions > Library**
2. Click **Create Action**
3. Name: `Smart College - Post Login`
4. Trigger: **Post Login**
5. Copy code from `auth0-actions/post-login.js`
6. Deploy

### Pre-Registration Action

1. Create action with **Pre User Registration** trigger
2. Copy code from `auth0-actions/pre-registration.js`
3. Deploy

### Credentials Exchange Action

1. Create action with **Credentials Exchange** trigger
2. Copy code from `auth0-actions/credentials-exchange.js`
3. Deploy

## 9. Configure Actions Flow

1. Go to **Actions > Flows**
2. Select **Post Login**
3. Drag and drop your custom action into the flow
4. Apply changes

## 10. Get Credentials for .env

### For Frontend (.env)
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=<from SPA application>
VITE_AUTH0_AUDIENCE=https://smart-college-api
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback
```

### For Backend (.env)
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://smart-college-api
AUTH0_CLIENT_ID=<from SPA application>
AUTH0_CLIENT_SECRET=<from SPA application>
AUTH0_MANAGEMENT_CLIENT_ID=<from M2M application>
AUTH0_MANAGEMENT_CLIENT_SECRET=<from M2M application>
```

## 11. Create Management API Application

1. Go to **Applications > APIs > Auth0 Management API**
2. Click **Machine to Machine Applications** tab
3. Authorize your M2M application
4. Add required scopes:
   - `create:users`
   - `read:users`
   - `update:users`
   - `create:role_members`
   - `read:roles`

## 12. Test Configuration

1. Run the frontend application
2. Click "Login"
3. You should see Auth0 Universal Login
4. Create a test user or use social login
5. Verify JWT contains custom claims

### Verify JWT Claims

Use [jwt.io](https://jwt.io) to decode your access token. It should contain:

```json
{
  "https://smart-college/role": "student",
  "https://smart-college/department": "Computer Science",
  "https://smart-college/email": "user@college.edu",
  "permissions": ["read:routine", "read:exams", ...]
}
```

## Troubleshooting

### "Invalid token" error
- Check AUTH0_DOMAIN is correct
- Verify AUTH0_AUDIENCE matches API identifier
- Ensure RS256 algorithm is used

### "Insufficient permissions" error
- Check user has correct role assigned
- Verify RBAC is enabled
- Check permissions are included in token

### MFA not working
- Ensure Adaptive MFA is enabled (Enterprise)
- Check MFA factors are configured
- Verify action code enables MFA correctly

## Security Best Practices

1. **Token Lifetime**: Keep access tokens short-lived (1-24 hours)
2. **Refresh Tokens**: Enable refresh token rotation
3. **CORS**: Only allow your frontend origin
4. **PKCE**: Always use for SPA applications
5. **Secrets**: Never commit secrets to version control
