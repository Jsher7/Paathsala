import mongoose from 'mongoose'

const labSubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabAssignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  testResults: [{
    testCaseId: { type: mongoose.Schema.Types.ObjectId },
    passed: { type: Boolean },
    input: { type: String },
    output: { type: String },
    expected: { type: String },
    isHidden: { type: Boolean }
  }],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 100 },
  attemptNumber: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'submitted', 'graded'], default: 'draft' }
})

labSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: false })

export default mongoose.model('LabSubmission', labSubmissionSchema)
