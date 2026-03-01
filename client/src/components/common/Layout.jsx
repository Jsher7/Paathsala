import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import LogoutButton from '../auth/LogoutButton.jsx'
import NotificationBell from './NotificationBell.jsx'
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineBookOpen,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineLibrary,
  HiOutlineCog,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineSpeakerphone,
  HiOutlineChatAlt2,
  HiOutlineChat,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardList,
  HiOutlineTicket,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineShieldCheck,
  HiOutlineChevronRight,
} from 'react-icons/hi'

const menuItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/routine', label: 'Routine', icon: HiOutlineCalendar, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/labs', label: 'Lab Assignments', icon: HiOutlineClipboardCheck, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/assignments', label: 'Assignments', icon: HiOutlineClipboardList, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/exams', label: 'Exams', icon: HiOutlineDocumentText, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/attendance', label: 'Attendance', icon: HiOutlineUserGroup, roles: ['student', 'teacher', 'admin'] },
  { path: '/app/feedback', label: 'Grievance Cell', icon: HiOutlineSpeakerphone, roles: ['student', 'admin', 'hod'] },
  { path: '/app/calendar', label: 'Calendar', icon: HiOutlineCalendar, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/ai-mentor', label: 'AI Mentor', icon: HiOutlineChat, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/forum', label: 'Campus Forum', icon: HiOutlineChatAlt2, roles: ['student', 'teacher', 'admin'] },
  { path: '/app/library', label: 'Library', icon: HiOutlineLibrary, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/jobs', label: 'Placements', icon: HiOutlineBriefcase, roles: ['student', 'tpo', 'admin', 'hod'] },
  { path: '/app/events', label: 'Events & Workshops', icon: HiOutlineTicket, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/security', label: 'Security', icon: HiOutlineShieldCheck, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/help', label: 'Support & Help', icon: HiOutlineQuestionMarkCircle, roles: ['student', 'teacher', 'admin', 'hod', 'tpo'] },
  { path: '/app/admin', label: 'Admin Panel', icon: HiOutlineCog, roles: ['admin', 'hod'] },
]

const roleColors = {
  admin: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
  teacher: { bg: 'rgba(6,182,212,0.12)', text: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
  hod: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  tpo: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  student: { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
}

function Layout() {
  const { user, role } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredMenu = menuItems.filter(item => item.roles.includes(role))
  const activeItem = filteredMenu.find(item => location.pathname.startsWith(item.path))
  const rc = roleColors[role] || roleColors.student

  return (
    <div
      className="min-h-screen flex relative"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient background mesh */}
      <div className="ambient-bg" />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 flex flex-col
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--border-subtle)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-5"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <Link
            to="/app"
            className="flex items-center gap-2.5 group"
            style={{ textDecoration: 'none' }}
          >
            {/* Logo mark */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow: '0 0 16px rgba(6,182,212,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt=""
                style={{ height: 22, width: 22, objectFit: 'contain' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<span style="color:#fff;font-family:Syne,sans-serif;font-weight:800;font-size:1rem">P</span>'
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Paathsala
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {filteredMenu.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <HiOutlineChevronRight
                    style={{ width: 14, height: 14, color: 'var(--accent-cyan)', opacity: 0.7 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div
            className="flex items-center gap-3 mb-3 p-3 rounded-2xl"
            style={{
              background: 'var(--bg-base)',
              boxShadow: 'var(--nm-shadow-in)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${rc.bg}`,
                border: `1px solid ${rc.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '1rem',
                color: rc.text,
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: 'var(--text-primary)',
                }}
              >
                {user?.name}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '1px 8px',
                  borderRadius: 999,
                  fontSize: '0.65rem',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: rc.bg,
                  color: rc.text,
                  border: `1px solid ${rc.border}`,
                }}
              >
                {role}
              </span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10" style={{ minWidth: 0 }}>

        {/* Header */}
        <header
          className="h-16 flex items-center px-4 lg:px-6 sticky top-0 z-30"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl mr-3 transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              boxShadow: 'var(--nm-shadow-out)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <HiOutlineMenu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            {activeItem && (
              <div className="flex items-center gap-2">
                <activeItem.icon
                  style={{ width: 18, height: 18, color: 'var(--accent-cyan)' }}
                />
                <h1
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {activeItem.label}
                </h1>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all"
              style={{
                background: 'var(--bg-elevated)',
                boxShadow: 'var(--nm-shadow-out)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode
                ? <HiOutlineSun className="w-5 h-5" style={{ color: '#f59e0b' }} />
                : <HiOutlineMoon className="w-5 h-5" />
              }
            </button>

            {/* Notification bell */}
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout