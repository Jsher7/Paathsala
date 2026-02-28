import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import LibraryResource from '../models/LibraryResource.js'
import User from '../models/User.js'
import { checkJwt, requireRole, getAuth0Id, getRole } from '../middleware/auth.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/library'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx']
    const ext = path.extname(file.originalname).toLowerCase()
    allowedTypes.includes(ext) ? cb(null, true) : cb(new Error('Invalid file type'))
  }
})

router.get('/', checkJwt, async (req, res) => {
  try {
    const { search, subject, type } = req.query
    
    let query = {}
    if (subject) query.subject = subject
    if (type) query.type = type
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const resources = await LibraryResource.find(query)
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'name')
    
    res.json({ resources })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id/download', checkJwt, async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id)
    
    if (!resource || resource.type !== 'file') {
      return res.status(404).json({ error: 'Resource not found' })
    }
    
    resource.downloads += 1
    await resource.save()
    
    res.download(resource.filePath, resource.fileName)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', checkJwt, requireRole('teacher', 'admin'), upload.single('file'), async (req, res) => {
  try {
    const auth0Id = getAuth0Id(req)
    const user = await User.findOne({ auth0Id })
    
    const { title, description, subject, type, url } = req.body
    
    const resourceData = {
      title,
      description,
      type,
      subject,
      uploadedBy: user._id
    }
    
    if (type === 'file' && req.file) {
      resourceData.filePath = req.file.path
      resourceData.fileName = req.file.originalname
      resourceData.fileSize = req.file.size
      resourceData.fileType = path.extname(req.file.originalname)
    } else if (type === 'link' && url) {
      resourceData.url = url
    }
    
    const resource = await LibraryResource.create(resourceData)
    
    res.json({ resource })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', checkJwt, requireRole('admin'), async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id)
    
    if (resource?.type === 'file' && resource.filePath) {
      fs.unlinkSync(resource.filePath)
    }
    
    await LibraryResource.findByIdAndDelete(req.params.id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
