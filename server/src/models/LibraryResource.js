import mongoose from 'mongoose'

const libraryResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['file', 'link'], required: true },
  
  filePath: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  
  url: { type: String },
  
  department: { type: String },
  subject: { type: String },
  semester: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 }
})

export default mongoose.model('LibraryResource', libraryResourceSchema)
