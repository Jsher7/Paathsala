import { useAuth } from '../../context/AuthContext.jsx'

function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 transition-all group"
      style={{
        padding: '9px 16px',
        borderRadius: 12,
        background: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--nm-shadow-out)',
        color: 'var(--text-muted)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.825rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
        e.currentTarget.style.color = '#f87171'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.color = 'var(--text-muted)'
        e.currentTarget.style.boxShadow = 'var(--nm-shadow-out)'
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Sign Out
    </button>
  )
}

export default LogoutButton

