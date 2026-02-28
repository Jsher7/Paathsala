import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import { HiOutlineClipboardCheck, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineBookOpen } from 'react-icons/hi'

function Dashboard() {
  const { user, role } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Pending Labs', value: stats?.stats?.pendingLabs || 0, icon: HiOutlineClipboardCheck, color: 'blue' },
    { label: 'Upcoming Exams', value: stats?.stats?.upcomingExams || 0, icon: HiOutlineDocumentText, color: 'orange' },
    { label: 'Classes Today', value: stats?.stats?.classesToday || 0, icon: HiOutlineCalendar, color: 'green' },
    { label: 'Library Resources', value: stats?.stats?.libraryResources || 0, icon: HiOutlineBookOpen, color: 'purple' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500">Here's what's happening today</p>
        </div>
        <span className={`badge badge-${role === 'admin' ? 'red' : role === 'teacher' ? 'blue' : 'green'}`}>
          {role}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          {stats?.todaySchedule?.length > 0 ? (
            <div className="space-y-3">
              {stats.todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-primary-600">{item.time}</div>
                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-gray-500">{item.room} • {item.teacher}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
          {stats?.announcements?.length > 0 ? (
            <div className="space-y-3">
              {stats.announcements.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent announcements</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
