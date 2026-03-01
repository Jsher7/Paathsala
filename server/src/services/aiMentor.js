import OpenAI from 'openai'
import User from '../models/User.js'
import WeeklyRoutine from '../models/WeeklyRoutine.js'
import Exam from '../models/Exam.js'
import Assignment from '../models/Assignment.js'
import AssignmentSubmission from '../models/AssignmentSubmission.js'
import LabAssignment from '../models/LabAssignment.js'
import LabSubmission from '../models/LabSubmission.js'
import AttendanceRecord from '../models/AttendanceRecord.js'
import AttendanceSession from '../models/AttendanceSession.js'
import Announcement from '../models/Announcement.js'
import CalendarEvent from '../models/CalendarEvent.js'
import LibraryResource from '../models/LibraryResource.js'
import Event from '../models/Event.js'

// Initialize OpenAI (or Groq) using environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
})

/**
 * Fetch all relevant platform data for a user to inject into the AI context.
 */
async function fetchPlatformContext(userId) {
  try {
    const user = await User.findById(userId).lean()
    if (!user) return ''

    const department = user.department || ''
    const role = user.role || 'student'

    // Fetch data in parallel for speed
    const [
      routine,
      exams,
      assignments,
      assignmentSubmissions,
      labAssignments,
      labSubmissions,
      attendanceSessions,
      attendanceRecords,
      announcements,
      calendarEvents,
      libraryResources,
      events
    ] = await Promise.all([
      WeeklyRoutine.find({ department, status: { $ne: 'cancelled' } }).sort({ day: 1, 'timeSlot.start': 1 }).lean().catch(() => []),
      Exam.find({}).sort({ scheduledDate: 1 }).lean().catch(() => []),
      Assignment.find({}).sort({ dueDate: 1 }).lean().catch(() => []),
      AssignmentSubmission.find({ studentId: userId }).lean().catch(() => []),
      LabAssignment.find({}).sort({ dueDate: 1 }).lean().catch(() => []),
      LabSubmission.find({ studentId: userId }).lean().catch(() => []),
      AttendanceSession.find({ department }).sort({ date: -1 }).limit(30).lean().catch(() => []),
      AttendanceRecord.find({ studentId: userId }).lean().catch(() => []),
      Announcement.find({}).sort({ createdAt: -1 }).limit(10).lean().catch(() => []),
      CalendarEvent.find({}).sort({ startDate: 1 }).lean().catch(() => []),
      LibraryResource.find({}).sort({ createdAt: -1 }).limit(20).lean().catch(() => []),
      Event.find({}).sort({ date: 1 }).lean().catch(() => [])
    ])

    // Build a structured context string
    let context = `\n--- PLATFORM DATA FOR USER: ${user.name} (${role}, ${department}) ---\n`

    // Routine / Timetable
    if (routine.length > 0) {
      context += '\n### Weekly Timetable:\n'
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      days.forEach((day, idx) => {
        const dayRoutine = routine.filter(r => r.day === idx || r.day === day)
        if (dayRoutine.length > 0) {
          context += `**${day}:**\n`
          dayRoutine.forEach(r => {
            context += `  - ${r.subject} (${r.timeSlot?.start || '?'} - ${r.timeSlot?.end || '?'}) Room: ${r.room || 'TBA'} | Status: ${r.status || 'active'}\n`
          })
        }
      })
    }

    // Exams
    if (exams.length > 0) {
      context += '\n### Upcoming Exams:\n'
      exams.slice(0, 10).forEach(e => {
        context += `- ${e.title} | Subject: ${e.subject || 'N/A'} | Date: ${e.scheduledDate ? new Date(e.scheduledDate).toLocaleDateString() : 'TBA'} | Duration: ${e.duration || '?'} min\n`
      })
    }

    // Assignments
    if (assignments.length > 0) {
      const submittedIds = new Set(assignmentSubmissions.map(s => s.assignmentId?.toString()))
      context += '\n### Assignments:\n'
      assignments.slice(0, 10).forEach(a => {
        const status = submittedIds.has(a._id?.toString()) ? '✅ Submitted' : '⏳ Pending'
        context += `- ${a.title} | Due: ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'TBA'} | Status: ${status}\n`
      })
    }

    // Lab Assignments
    if (labAssignments.length > 0) {
      const labSubmittedIds = new Set(labSubmissions.map(s => s.assignmentId?.toString()))
      context += '\n### Lab Assignments:\n'
      labAssignments.slice(0, 10).forEach(l => {
        const status = labSubmittedIds.has(l._id?.toString()) ? '✅ Submitted' : '⏳ Pending'
        context += `- ${l.title} | Due: ${l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'TBA'} | Status: ${status}\n`
      })
    }

    // Attendance Summary
    if (attendanceSessions.length > 0) {
      const totalSessions = attendanceSessions.length
      const attendedSessions = attendanceRecords.filter(r => r.status === 'present').length
      const percentage = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0
      context += `\n### Attendance Summary:\n`
      context += `- Total Sessions: ${totalSessions} | Attended: ${attendedSessions} | Overall: ${percentage}%\n`
      if (percentage < 75) {
        context += `- ⚠️ WARNING: Attendance is below 75%!\n`
      }
    }

    // Announcements
    if (announcements.length > 0) {
      context += '\n### Recent Announcements:\n'
      announcements.slice(0, 5).forEach(a => {
        context += `- ${a.title}: ${a.content?.substring(0, 100) || ''}... (${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''})\n`
      })
    }

    // Calendar Events
    if (calendarEvents.length > 0) {
      context += '\n### Academic Calendar Events:\n'
      calendarEvents.slice(0, 10).forEach(c => {
        context += `- ${c.title} | ${c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBA'}${c.isHoliday ? ' 🎉 Holiday' : ''}\n`
      })
    }

    // Library Resources
    if (libraryResources.length > 0) {
      context += '\n### Library Resources:\n'
      libraryResources.slice(0, 10).forEach(r => {
        context += `- ${r.title} (${r.type || 'resource'}) | Subject: ${r.subject || 'General'}\n`
      })
    }

    // Events & Workshops
    if (events.length > 0) {
      context += '\n### Events & Workshops:\n'
      events.slice(0, 10).forEach(e => {
        context += `- ${e.title} | Date: ${e.date ? new Date(e.date).toLocaleDateString() : 'TBA'} | Location: ${e.location || 'TBA'}\n`
      })
    }

    context += '\n--- END OF PLATFORM DATA ---\n'
    return context
  } catch (error) {
    console.error('Error fetching platform context:', error)
    return ''
  }
}

/**
 * Main chat function. Accepts a user query, chat history, and user's MongoDB ID.
 */
export async function chatWithMentor(query, history = [], userId = null) {
  // Fetch platform data for the authenticated user
  let platformContext = ''
  if (userId) {
    platformContext = await fetchPlatformContext(userId)
  }

  const systemPrompt = `You are "Paathsala AI Mentor", an intelligent assistant built into the Paathsala college management platform.

## YOUR STRICT RULES:
1. You may ONLY answer questions related to:
   - The Paathsala platform (timetable, exams, assignments, attendance, library, events, announcements, calendar, labs, forums, placements, grievances)
   - Education and academics (study tips, concept explanations, exam preparation, programming help, subject tutoring)
   - College life and career guidance (placements, internships, resume tips, interview prep)

2. You MUST REFUSE to answer questions about:
   - Entertainment (movies, music, games, celebrities, jokes, memes)
   - Politics, religion, or controversial social topics
   - Personal advice unrelated to education (dating, relationships)
   - General knowledge unrelated to academics (weather, sports scores, cooking recipes)
   - Anything violent, harmful, or inappropriate

3. When refusing, respond EXACTLY in this format:
   "🚫 I'm your Paathsala AI Mentor — I can only help with education and platform-related questions! Try asking me about your classes, exams, assignments, attendance, or any academic topic. 📚"

4. When answering questions about the platform, use the PLATFORM DATA provided below to give accurate, personalized answers. Reference specific data like class times, exam dates, assignment deadlines, and attendance percentages.

5. Format your responses cleanly with bullet points, bold text, and emojis where appropriate for readability.

6. Be concise but thorough. Do not pad responses with unnecessary filler.

${platformContext ? `\n## PLATFORM DATA (use this to answer platform-specific questions):\n${platformContext}` : '\n## NOTE: No platform data is currently available. Answer general education questions only.'}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: 'user', content: query }
  ]

  try {
    const modelToUse = process.env.OPENAI_BASE_URL ? 'llama-3.1-8b-instant' : 'gpt-4o'

    const response = await openai.chat.completions.create({
      model: modelToUse,
      messages,
      max_tokens: 1500,
      temperature: 0.5
    })

    const answer = response.choices[0].message.content

    return {
      answer,
      sources: [],
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('AI Mentor error:', error)
    return {
      answer: "I'm currently unable to connect to my intelligence service. Please check the API configuration or try again later.",
      sources: [],
      timestamp: new Date().toISOString()
    }
  }
}
