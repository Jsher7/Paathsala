import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import toast from 'react-hot-toast'
import { HiOutlineClock, HiOutlineDocumentText } from 'react-icons/hi'

function Exams() {
  const { role } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const response = await api.get('/exam')
      setExams(response.data.exams || [])
    } catch (error) {
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const getExamStatus = (exam) => {
    const now = new Date()
    const start = new Date(exam.startTime)
    const end = new Date(exam.endTime)

    if (exam.attempt?.status === 'submitted') return { label: 'Completed', color: 'green' }
    if (exam.attempt?.status === 'auto_submitted') return { label: 'Auto-Submitted', color: 'red' }
    if (now < start) return { label: 'Upcoming', color: 'blue' }
    if (now >= start && now <= end) return { label: 'Available', color: 'yellow' }
    return { label: 'Ended', color: 'gray' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
        {(role === 'teacher' || role === 'admin') && (
          <Link to="/app/exams/create" className="btn-primary">
            Create Exam
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map(exam => {
          const status = getExamStatus(exam)
          return (
            <div key={exam._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <span className="badge badge-blue">{exam.subject}</span>
                <span className={`badge badge-${status.color}`}>{status.label}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <HiOutlineClock className="w-4 h-4" />
                  <span>
                    {new Date(exam.startTime).toLocaleString()} - {new Date(exam.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineDocumentText className="w-4 h-4" />
                  <span>{exam.totalQuestions} questions • {exam.duration} mins</span>
                </div>
              </div>

              {exam.attempt?.score !== undefined && (
                <div className="mb-4 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Score: {exam.attempt.score}/{exam.totalPoints} ({exam.attempt.percentage}%)
                  </p>
                </div>
              )}
              
              {status.label === 'Available' && !exam.attempt && (
                <Link
                  to={`/app/exams/${exam._id}`}
                  className="btn-primary w-full text-center block"
                >
                  Start Exam
                </Link>
              )}
              
              {status.label === 'Completed' && (
                <Link
                  to={`/app/exams/${exam._id}/result`}
                  className="btn-secondary w-full text-center block"
                >
                  View Result
                </Link>
              )}

              {status.label === 'Auto-Submitted' && exam.attempt?.requiresReapproval && (
                <div className="p-2 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                  Auto-submitted. Contact admin for re-approval.
                </div>
              )}
            </div>
          )
        })}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <HiOutlineDocumentText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No exams scheduled</p>
        </div>
      )}
    </div>
  )
}

export default Exams
