import { Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from '../components/auth/LoginButton.jsx'

const features = [
  { icon: '📅', label: 'Smart', sub: 'Routine' },
  { icon: '🧪', label: 'Lab', sub: 'Assignments' },
  { icon: '🤖', label: 'AI', sub: 'Mentor' },
  { icon: '🛡️', label: 'Secure', sub: 'Exams' },
]

function Home() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="spinner" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 60% at 15% 20%, rgba(6,182,212,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 75%, rgba(139,92,246,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)
        `
      }} />

      {/* Decorative ring */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        border: '1px solid rgba(6,182,212,0.07)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 900,
        height: 900,
        borderRadius: '50%',
        border: '1px solid rgba(6,182,212,0.04)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Logo mark */}
        <div style={{
          width: 80, height: 80,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          boxShadow: '0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '2rem',
        }}>
          <span style={{ color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem' }}>P</span>
        </div>

        {/* Wordmark */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginBottom: 16,
          background: 'linear-gradient(135deg, #e2e8f0 30%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Paathsala
        </h1>

        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          marginBottom: 40,
          lineHeight: 1.7,
          maxWidth: 420,
          marginInline: 'auto',
        }}>
          Your all-in-one intelligent platform for routines, assignments, exams, AI mentoring, and more.
        </p>

        {/* Login button */}
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
          <LoginButton />
        </div>

        {/* Feature grid — glassmorphic cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {features.map(({ icon, label, sub }, i) => (
            <div
              key={i}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 16,
                padding: '18px 12px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                animation: `fadeSlideUp 0.5s ease ${i * 0.1}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(6,182,212,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.borderColor = 'var(--glass-border)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '-0.02em',
              }}>{label}</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: 2,
              }}>{sub}</div>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: 32,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          opacity: 0.6,
          letterSpacing: '0.03em',
        }}>
          Secured by Auth0 · Protected by JWT Authentication
        </p>
      </div>
    </div>
  )
}

export default Home
