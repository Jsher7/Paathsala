import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import LogoutButton from '../auth/LogoutButton.jsx'
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineBookOpen,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineLibrary,
  HiOutlineChat,
  HiOutlineCog,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi'

const menuItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/routine', label: 'Routine', icon: HiOutlineCalendar, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/labs', label: 'Lab Assignments', icon: HiOutlineClipboardCheck, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/exams', label: 'Exams', icon: HiOutlineDocumentText, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/calendar', label: 'Calendar', icon: HiOutlineCalendar, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/ai-mentor', label: 'AI Mentor', icon: HiOutlineChat, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/library', label: 'Library', icon: HiOutlineLibrary, roles: ['student', 'teacher', 'admin', 'hod'] },
  { path: '/app/admin', label: 'Admin Panel', icon: HiOutlineCog, roles: ['admin', 'hod'] },
]

function Layout() {
  const { user, role } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredMenu = menuItems.filter(item => item.roles.includes(role))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link to="/app" className="text-xl font-bold text-primary-600">
              Academy of Technology
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <HiOutlineMenu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {filteredMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
          </h1>
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
