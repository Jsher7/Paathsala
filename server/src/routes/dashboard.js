import express from 'express'
import User from '../models/User.js'
import WeeklyRoutine from '../models/WeeklyRoutine.js'
import LabAssignment from '../models/LabAssignment.js'
import LabSubmission from '../models/LabSubmission.js'
import Exam from '../models/Exam.js'
import LibraryResource from '../models/LibraryResource.js'
import { checkJwt, getAuth0Id, getRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', checkJwt, async (req, res) => {
  try {
    const auth0Id = getAuth0Id(req)
    const user = await User.findOne({ auth0Id })
    const role = getRole(req)
    
    const today = new Date()
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
    
    const pendingLabs = await LabAssignment.countDocuments({
      department: user.department,
      dueDate: { $gte: today }
    })
    
    const upcomingExams = await Exam.countDocuments({
      department: user.department,
      endTime: { $gte: today }
    })
    
    const classesToday = await WeeklyRoutine.countDocuments({
      department: user.department,
      day: dayName,
      status: { $ne: 'cancelled' }
    })
    
    const libraryResources = await LibraryResource.countDocuments()
    
    const todaySchedule = await WeeklyRoutine.find({
      department: user.department,
      day: dayName,
      status: { $ne: 'cancelled' }
    })
      .populate('teacherId', 'name')
      .sort({ 'timeSlot.start': 1 })
    
    const announcements = []
    
    res.json({
      stats: {
        pendingLabs,
        upcomingExams,
        classesToday,
        libraryResources
      },
      todaySchedule: todaySchedule.map(s => ({
        time: `${s.timeSlot.start} - ${s.timeSlot.end}`,
        subject: s.subject,
        room: s.room,
        teacher: s.teacherId?.name
      })),
      announcements
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
