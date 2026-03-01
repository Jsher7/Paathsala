import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../utils/api.js'
import toast from 'react-hot-toast'
import { HiOutlinePaperAirplane, HiOutlineAcademicCap, HiOutlineShieldExclamation } from 'react-icons/hi'

function AIMentor() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/ai-mentor/chat', {
        query: input,
        history: messages.slice(-10)
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || []
      }])
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to get response')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        sources: []
      }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    "What's my class schedule today?",
    "Show my attendance summary",
    "Do I have any pending assignments?",
    "What exams are coming up?",
    "Explain object-oriented programming",
    "Help me prepare for my next exam"
  ]

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <HiOutlineAcademicCap className="w-7 h-7 text-primary-500" />
          Paathsala AI Mentor
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Your personal academic assistant — ask about classes, exams, assignments & more</p>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Scope Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 px-4 py-2 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
          <HiOutlineShieldExclamation className="w-4 h-4 flex-shrink-0" />
          <span>This AI Mentor only answers questions about your academics and the Paathsala platform.</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <HiOutlineAcademicCap className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Hi {user?.name}! 👋</p>
              <p className="text-gray-500 dark:text-gray-400 mb-2">I'm your Paathsala AI Mentor.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                I can help you with your classes, exams, assignments, attendance, and any academic topic.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="text-sm px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 hover:from-primary-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-600 text-primary-700 dark:text-primary-300 rounded-full transition-all duration-200 border border-primary-100 dark:border-gray-600 hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sources:</p>
                    {msg.sources.map((source, sIndex) => (
                      <a
                        key={sIndex}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline block"
                      >
                        ↗ {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your classes, exams, assignments..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-4"
            >
              <HiOutlinePaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AIMentor
