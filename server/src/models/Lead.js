import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    // false until n8n accepts the lead; services/leadRetry.js re-sends the ones still false
    forwarded: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Lead = mongoose.model('Lead', leadSchema)
