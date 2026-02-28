import mongoose from 'mongoose'

const routineSwapRequestSchema = new mongoose.Schema({
  baseRoutineId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeeklyRoutine', required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true },
  timeSlot: { type: Object, required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  room: { type: String },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('RoutineSwapRequest', routineSwapRequestSchema)
