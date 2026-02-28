import express from 'express'
import { checkJwt, getAuth0Id } from '../middleware/auth.js'
import { chatWithMentor } from '../services/aiMentor.js'

const router = express.Router()

router.post('/chat', checkJwt, async (req, res) => {
  try {
    const { query, history = [] } = req.body
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' })
    }
    
    const result = await chatWithMentor(query, history)
    
    res.json(result)
  } catch (error) {
    console.error('AI Mentor error:', error)
    res.status(500).json({ error: error.message || 'Failed to process query' })
  }
})

export default router
