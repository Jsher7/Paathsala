import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import {
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineDesktopComputer,
    HiOutlineGlobe,
    HiOutlineFingerPrint,
    HiOutlineLightBulb,
    HiOutlineExclamation,
    HiOutlineEye,
    HiOutlineRefresh
} from 'react-icons/hi'

/* ── Stat card accent colours ─────────────────────────── */
const statMeta = [
    {
        key: 'clock',
        icon: HiOutlineClock,
        label: 'Last Login',
        accent: '#06b6d4',
        glow: 'rgba(6,182,212,0.18)',
    },
    {
        key: 'device',
        icon: HiOutlineDesktopComputer,
        label: 'Device',
        accent: '#10b981',
        glow: 'rgba(16,185,129,0.18)',
    },
    {
        key: 'ip',
        icon: HiOutlineGlobe,
        label: 'IP Address',
        accent: '#8b5cf6',
        glow: 'rgba(139,92,246,0.18)',
    },
    {
        key: 'count',
        icon: HiOutlineFingerPrint,
        label: 'Total Logins',
        accent: '#f59e0b',
        glow: 'rgba(245,158,11,0.18)',
    },
]

const roleChipStyle = {
    admin: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
    teacher: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
    hod: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    student: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
}

function Security() {
    const { user, role } = useAuth()
    const [activeTab, setActiveTab] = useState('activity')
    const [loginData, setLoginData] = useState(null)
    const [allUsersData, setAllUsersData] = useState(null)
    const [loading, setLoading] = useState(true)

    const canSeeAllUsers = ['teacher', 'hod', 'admin'].includes(role)

    useEffect(() => { fetchLoginActivity() }, [])
    useEffect(() => {
        if (activeTab === 'allUsers' && !allUsersData && canSeeAllUsers)
            fetchAllUsersActivity()
    }, [activeTab])

    const fetchLoginActivity = async () => {
        try {
            const res = await api.get('/security/login-activity')
            setLoginData(res.data)
        } catch (err) {
            console.error('Failed to fetch login activity:', err)
        } finally { setLoading(false) }
    }

    const fetchAllUsersActivity = async () => {
        try {
            const res = await api.get('/security/all-users-activity')
            setAllUsersData(res.data.users)
        } catch (err) {
            console.error('Failed to fetch all users activity:', err)
        }
    }

    const parseDevice = (ua) => {
        if (!ua) return 'Unknown'
        if (ua.includes('Chrome')) return '🌐 Chrome'
        if (ua.includes('Firefox')) return '🦊 Firefox'
        if (ua.includes('Safari') && !ua.includes('Chrome')) return '🧭 Safari'
        if (ua.includes('Edge')) return '🔵 Edge'
        return '🌐 Browser'
    }

    const parseOS = (ua) => {
        if (!ua) return ''
        if (ua.includes('Windows')) return 'Windows'
        if (ua.includes('Mac')) return 'macOS'
        if (ua.includes('Linux')) return 'Linux'
        if (ua.includes('Android')) return 'Android'
        if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
        return ''
    }

    const formatDate = (date) => {
        if (!date) return 'Never'
        return new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    }

    const formatRelative = (date) => {
        if (!date) return ''
        const diff = Date.now() - new Date(date).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    const tabs = [
        { id: 'activity', label: 'Login Activity', icon: HiOutlineClock },
        ...(canSeeAllUsers ? [{ id: 'allUsers', label: 'All Users', icon: HiOutlineEye }] : []),
        { id: 'tips', label: 'Safety Tips', icon: HiOutlineLightBulb },
    ]

    const safetyTips = [
        { title: 'Use Strong Passwords', desc: 'Combine uppercase, lowercase, numbers, and symbols. Never reuse passwords across platforms.', icon: '🔐', accent: '#06b6d4' },
        { title: 'Enable Two-Factor Auth', desc: 'Add an extra layer of security to your college account with 2FA via authenticator apps.', icon: '📱', accent: '#10b981' },
        { title: 'Beware of Phishing Emails', desc: 'Never click links from unknown senders. Verify the sender\'s email domain before responding.', icon: '🎣', accent: '#f87171' },
        { title: 'Keep Software Updated', desc: 'Always update your browser, OS, and apps to patch security vulnerabilities.', icon: '🔄', accent: '#8b5cf6' },
        { title: 'Use Secure Wi-Fi', desc: 'Avoid public Wi-Fi for accessing sensitive accounts. Use VPN if needed.', icon: '📡', accent: '#f59e0b' },
        { title: "Don't Share Credentials", desc: 'Never share your login details with anyone, including friends or even college staff.', icon: '🤫', accent: '#a78bfa' },
        { title: 'Lock Your Devices', desc: 'Always lock your laptop/phone when stepping away. Use fingerprint or face unlock.', icon: '🔒', accent: '#22d3ee' },
        { title: 'Report Suspicious Activity', desc: 'If you notice unauthorized logins or unusual behavior, report it immediately to the admin.', icon: '🚨', accent: '#fb923c' },
    ]

    /* ── Shared surface style ─────────────────────────── */
    const glassSurface = {
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }

    /* ── stat card value lookup ────────────────────────── */
    const statValues = loginData
        ? [
            { main: formatDate(loginData.lastLoginAt), sub: formatRelative(loginData.lastLoginAt) },
            { main: parseDevice(loginData.lastLoginDevice), sub: parseOS(loginData.lastLoginDevice) },
            { main: loginData.lastLoginIP || 'N/A', sub: null, mono: true },
            { main: loginData.loginCount, sub: 'sessions', big: true },
        ]
        : Array(4).fill({ main: '—', sub: null })

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="space-y-6 animate-fade-up">

            {/* ── PAGE HEADER ──────────────────────────────── */}
            <div className="flex items-center gap-4">
                <div style={{
                    width: 52, height: 52,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.06))',
                    border: '1px solid rgba(6,182,212,0.3)',
                    boxShadow: '0 0 24px rgba(6,182,212,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <HiOutlineShieldCheck style={{ width: 26, height: 26, color: '#06b6d4' }} />
                </div>
                <div>
                    <h1 style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.6rem',
                        letterSpacing: '-0.03em',
                        color: 'var(--text-primary)',
                    }}>
                        Security Center
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 2 }}>
                        Monitor login activity &amp; digital safety
                    </p>
                </div>
            </div>

            {/* ── PILL TABS ─────────────────────────────────── */}
            <div style={{
                display: 'flex',
                gap: 4,
                background: 'var(--bg-base)',
                borderRadius: 16,
                padding: 5,
                boxShadow: 'var(--nm-shadow-in)',
                overflowX: 'auto',
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '9px 20px',
                            borderRadius: 12,
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '0.85rem',
                            fontWeight: activeTab === tab.id ? 600 : 500,
                            color: activeTab === tab.id ? '#06b6d4' : 'var(--text-muted)',
                            background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                            border: activeTab === tab.id ? '1px solid rgba(6,182,212,0.25)' : '1px solid transparent',
                            boxShadow: activeTab === tab.id ? 'var(--nm-shadow-out)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <tab.icon style={{ width: 16, height: 16 }} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════════
                TAB: LOGIN ACTIVITY
                ══════════════════════════════════════════════ */}
            {activeTab === 'activity' && (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    {loginData && (
                        <div
                            className="grid gap-4 stagger-children"
                            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
                        >
                            {statMeta.map((meta, i) => {
                                const val = statValues[i]
                                return (
                                    <div
                                        key={meta.key}
                                        className="animate-fade-up"
                                        style={{
                                            ...glassSurface,
                                            padding: '20px 22px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-3px)'
                                            e.currentTarget.style.boxShadow = `0 16px 40px ${meta.glow}`
                                            e.currentTarget.style.borderColor = meta.accent + '40'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = ''
                                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)'
                                            e.currentTarget.style.borderColor = 'var(--glass-border)'
                                        }}
                                    >
                                        {/* Top glow line */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                            background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                                            opacity: 0.7,
                                        }} />

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                                        }}>
                                            <div style={{
                                                width: 36, height: 36,
                                                borderRadius: 10,
                                                background: `${meta.glow}`,
                                                border: `1px solid ${meta.accent}33`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <meta.icon style={{ width: 18, height: 18, color: meta.accent }} />
                                            </div>
                                            <span style={{
                                                fontFamily: 'Syne, sans-serif',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-muted)',
                                            }}>
                                                {meta.label}
                                            </span>
                                        </div>

                                        <p style={{
                                            fontFamily: val?.big ? 'Syne, sans-serif' : 'DM Sans, sans-serif',
                                            fontWeight: 700,
                                            fontSize: val?.big ? '2.2rem' : '1rem',
                                            letterSpacing: val?.big ? '-0.03em' : 0,
                                            color: 'var(--text-primary)',
                                            fontVariantNumeric: 'tabular-nums',
                                            fontFamily: val?.mono ? 'monospace' : undefined,
                                        }}>
                                            {val?.main}
                                        </p>
                                        {val?.sub && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                {val.sub}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Login History Table */}
                    <div style={{ ...glassSurface, overflow: 'hidden', padding: 0 }}>
                        <div style={{
                            padding: '18px 24px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <h3 style={{
                                fontFamily: 'Syne, sans-serif',
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: 'var(--text-primary)',
                            }}>
                                Recent Login History
                            </h3>
                            <button
                                onClick={fetchLoginActivity}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px', borderRadius: 8,
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
                                    color: '#06b6d4', background: 'rgba(6,182,212,0.08)',
                                    border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.14)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.08)'}
                            >
                                <HiOutlineRefresh style={{ width: 14, height: 14 }} />
                                Refresh
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.12)' }}>
                                        {['Date & Time', 'Browser', 'OS', 'IP Address'].map(h => (
                                            <th key={h} style={{
                                                textAlign: 'left',
                                                padding: '12px 20px',
                                                fontFamily: 'Syne, sans-serif',
                                                fontSize: '0.68rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-muted)',
                                                borderBottom: '1px solid var(--border-subtle)',
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loginData?.loginHistory?.map((entry, i) => (
                                        <tr
                                            key={i}
                                            style={{
                                                background: i === 0 ? 'rgba(16,185,129,0.05)' : 'transparent',
                                                borderBottom: '1px solid var(--border-subtle)',
                                                transition: 'background 0.2s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'rgba(16,185,129,0.05)' : 'transparent'}
                                        >
                                            <td style={{ padding: '12px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                <span>{formatDate(entry.loginAt)}</span>
                                                {i === 0 && (
                                                    <span style={{
                                                        marginLeft: 8,
                                                        padding: '2px 8px',
                                                        borderRadius: 999,
                                                        fontSize: '0.65rem',
                                                        fontFamily: 'Syne, sans-serif',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.05em',
                                                        textTransform: 'uppercase',
                                                        background: 'rgba(16,185,129,0.12)',
                                                        color: '#34d399',
                                                        border: '1px solid rgba(16,185,129,0.25)',
                                                    }}>
                                                        Current
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{parseDevice(entry.device)}</td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{parseOS(entry.device)}</td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{entry.ip}</td>
                                        </tr>
                                    )) || (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                    No login history available yet
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TAB: ALL USERS
                ══════════════════════════════════════════════ */}
            {activeTab === 'allUsers' && canSeeAllUsers && (
                <div style={{ ...glassSurface, overflow: 'hidden', padding: 0 }}>
                    <div style={{
                        padding: '18px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <h3 style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                        }}>
                            All Users Login Activity
                        </h3>
                        <button
                            onClick={fetchAllUsersActivity}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '6px 12px', borderRadius: 8,
                                fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
                                color: '#06b6d4', background: 'rgba(6,182,212,0.08)',
                                border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.08)'}
                        >
                            <HiOutlineRefresh style={{ width: 14, height: 14 }} />
                            Refresh
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.12)' }}>
                                    {['Name', 'Email', 'Role', 'Department', 'Logins', 'Last Login', 'Device'].map(h => (
                                        <th key={h} style={{
                                            textAlign: 'left',
                                            padding: '12px 20px',
                                            fontFamily: 'Syne, sans-serif',
                                            fontSize: '0.68rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'var(--text-muted)',
                                            borderBottom: '1px solid var(--border-subtle)',
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allUsersData?.map((u, i) => {
                                    const rc = roleChipStyle[u.role] || roleChipStyle.student
                                    return (
                                        <tr
                                            key={i}
                                            style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '12px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                {u.name}
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                                {u.email}
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <span style={{
                                                    padding: '2px 10px',
                                                    borderRadius: 999,
                                                    fontSize: '0.65rem',
                                                    fontFamily: 'Syne, sans-serif',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase',
                                                    background: rc.bg,
                                                    color: rc.color,
                                                    border: `1px solid ${rc.border}`,
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                {u.department || '—'}
                                            </td>
                                            <td style={{ padding: '12px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#06b6d4' }}>
                                                {u.loginCount || 0}
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {formatDate(u.lastLoginAt)}
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                {parseDevice(u.lastLoginDevice)}
                                            </td>
                                        </tr>
                                    )
                                }) || (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TAB: SAFETY TIPS
                ══════════════════════════════════════════════ */}
            {activeTab === 'tips' && (
                <div className="space-y-5">
                    {/* Banner */}
                    <div style={{
                        background: 'rgba(245,158,11,0.07)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: 16,
                        padding: '16px 20px',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                        <HiOutlineExclamation style={{ width: 22, height: 22, color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                        <div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f59e0b', marginBottom: 2 }}>
                                Stay Safe Online
                            </h3>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'rgba(245,158,11,0.8)' }}>
                                Follow these best practices to protect your personal and academic data.
                            </p>
                        </div>
                    </div>

                    {/* Tips Grid */}
                    <div
                        className="stagger-children"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {safetyTips.map((tip, i) => (
                            <div
                                key={i}
                                className="animate-fade-up"
                                style={{
                                    ...glassSurface,
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 16,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'default',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                    e.currentTarget.style.borderColor = tip.accent + '50'
                                    e.currentTarget.style.boxShadow = `0 16px 40px ${tip.accent}20`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = ''
                                    e.currentTarget.style.borderColor = 'var(--glass-border)'
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)'
                                }}
                            >
                                {/* Left accent stripe */}
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                                    borderRadius: '20px 0 0 20px',
                                    background: `linear-gradient(180deg, ${tip.accent}, transparent)`,
                                    opacity: 0.7,
                                }} />

                                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{tip.icon}</span>

                                <div>
                                    <h4 style={{
                                        fontFamily: 'Syne, sans-serif',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        color: 'var(--text-primary)',
                                        marginBottom: 6,
                                    }}>
                                        {tip.title}
                                    </h4>
                                    <p style={{
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '0.82rem',
                                        color: 'var(--text-muted)',
                                        lineHeight: 1.6,
                                    }}>
                                        {tip.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Security
