import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin', 'hod'], default: 'student' },
  department: { type: String },
  batch: { type: Number },
  passwordChanged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
