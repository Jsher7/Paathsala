import mongoose from 'mongoose'

const labAssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  subject: { type: String },
  language: { type: String, enum: ['python', 'javascript', 'java', 'cpp', 'sql'], required: true },
  starterCode: { type: String, default: '' },
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    points: { type: Number, default: 10 }
  }],
  dueDate: { type: Date, required: true },
  maxAttempts: { type: Number, default: 10 },
  points: { type: Number, default: 100 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('LabAssignment', labAssignmentSchema)
