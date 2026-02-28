import mongoose from 'mongoose'

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  endDate: { type: Date },
  type: { 
    type: String, 
    enum: ['holiday', 'special_holiday', 'exam', 'assignment_deadline', 'event'], 
    default: 'event' 
  },
  department: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('CalendarEvent', calendarEventSchema)
