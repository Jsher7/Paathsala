import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import toast from 'react-hot-toast'
import Editor from '@monaco-editor/react'

const LANGUAGE_MAP = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
  sql: 'sql'
}

function LabDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lab, setLab] = useState(null)
  const [code, setCode] = useState('')
  const [results, setResults] = useState(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLab()
  }, [id])

  const fetchLab = async () => {
    try {
      const response = await api.get(`/lab/${id}`)
      setLab(response.data.lab)
      setCode(response.data.lab.starterCode || '')
      if (response.data.submission) {
        setCode(response.data.submission.code)
        setResults(response.data.submission.testResults)
      }
    } catch (error) {
      toast.error('Failed to load lab')
      navigate('/app/labs')
    } finally {
      setLoading(false)
    }
  }

  const runTests = async () => {
    setRunning(true)
    setResults(null)
    try {
      const response = await api.post(`/lab/${id}/run`, { code })
      setResults(response.data.results)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to run tests')
    } finally {
      setRunning(false)
    }
  }

  const submitLab = async () => {
    setSubmitting(true)
    try {
      const response = await api.post(`/lab/${id}/submit`, { code })
      setResults(response.data.results)
      toast.success(`Lab submitted! Score: ${response.data.score}/${response.data.totalPoints}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit lab')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lab) {
    return <div>Lab not found</div>
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{lab.title}</h1>
          <p className="text-sm text-gray-500">{lab.language} • {lab.points} points</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runTests}
            disabled={running}
            className="btn-secondary"
          >
            {running ? 'Running...' : 'Run Tests'}
          </button>
          <button
            onClick={submitLab}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm">
            {lab.language}
          </div>
          <Editor
            language={LANGUAGE_MAP[lab.language] || 'plaintext'}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              scrollBeyondLastLine: false
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="w-96 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium text-sm">
            Test Results
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {results ? (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Test Case {index + 1}
                    </span>
                    <span className={`text-xs font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  {!result.isHidden && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Input:</strong> {result.input}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Expected:</strong> {result.expected}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Output:</strong> {result.output}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center text-sm">
                Run tests to see results
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabDetail
