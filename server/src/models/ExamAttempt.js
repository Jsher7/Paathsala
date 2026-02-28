import mongoose from 'mongoose'

const examAttemptSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Map, of: String },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'submitted', 'auto_submitted', 'cancelled'], 
    default: 'not_started' 
  },
  startedAt: { type: Date },
  submittedAt: { type: Date },
  autoSubmitReason: { type: String },
  score: { type: Number },
  percentage: { type: Number },
  requiresReapproval: { type: Boolean, default: false },
  reapprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'] },
  reapprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

examAttemptSchema.index({ examId: 1, studentId: 1 }, { unique: true })

export default mongoose.model('ExamAttempt', examAttemptSchema)
