import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin', 'hod', 'tpo'], default: 'student' },
  department: { type: String },
  batch: { type: Number },
  xp: { type: Number, default: 0 },
  passwordChanged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Login Tracking
  loginCount: { type: Number, default: 0 },
  lastLoginAt: { type: Date },
  lastLoginDevice: { type: String },
  lastLoginIP: { type: String },
  loginHistory: [{
    loginAt: { type: Date, default: Date.now },
    device: { type: String },
    ip: { type: String },
    _id: false
  }]
})

export default mongoose.model('User', userSchema)
