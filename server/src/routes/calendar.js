import express from 'express'
import CalendarEvent from '../models/CalendarEvent.js'
import User from '../models/User.js'
import { checkJwt, requireRole, getAuth0Id } from '../middleware/auth.js'

const router = express.Router()

router.get('/', checkJwt, async (req, res) => {
  try {
    const events = await CalendarEvent.find()
      .sort({ date: 1 })
      .populate('createdBy', 'name')
    
    res.json({ events })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', checkJwt, requireRole('admin', 'hod'), async (req, res) => {
  try {
    const auth0Id = getAuth0Id(req)
    const user = await User.findOne({ auth0Id })
    
    const event = await CalendarEvent.create({
      ...req.body,
      createdBy: user._id
    })
    
    res.json({ event })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', checkJwt, requireRole('admin'), async (req, res) => {
  try {
    await CalendarEvent.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
