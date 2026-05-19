import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'released'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String
  }],
  completedAt: {
    type: Date
  },
  releasedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Milestone', milestoneSchema);