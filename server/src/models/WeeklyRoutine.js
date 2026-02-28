import mongoose from 'mongoose'

const weeklyRoutineSchema = new mongoose.Schema({
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  subject: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String },
  room: { type: String },
  status: { type: String, enum: ['active', 'unavailable', 'swapped', 'cancelled'], default: 'active' },
  replacementTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('WeeklyRoutine', weeklyRoutineSchema)
