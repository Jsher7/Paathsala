import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import RoleRoute from './components/auth/RoleRoute.jsx'

import Layout from './components/common/Layout.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Routine from './pages/Routine.jsx'
import Labs from './pages/Labs.jsx'
import LabDetail from './pages/LabDetail.jsx'
import Exams from './pages/Exams.jsx'
import ExamPage from './pages/ExamPage.jsx'
import Calendar from './pages/Calendar.jsx'
import AIMentor from './pages/AIMentor.jsx'
import Library from './pages/Library.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Profile from './pages/Profile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Callback from './pages/Callback.jsx'

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your_client_id',
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://smart-college-api',
    scope: 'openid profile email'
  }
}

function App() {
  return (
    <Auth0Provider {...auth0Config}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="routine" element={<Routine />} />
              <Route path="labs" element={<Labs />} />
              <Route path="labs/:id" element={<LabDetail />} />
              <Route path="exams" element={<Exams />} />
              <Route path="exams/:id" element={<ExamPage />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="ai-mentor" element={<AIMentor />} />
              <Route path="library" element={<Library />} />
              <Route path="profile" element={<Profile />} />

              <Route path="admin/*" element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </RoleRoute>
              } />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </Auth0Provider>
  )
}

export default App
