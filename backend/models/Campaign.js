import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'education', 'environment', 'disaster', 'community', 'other']
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }],
  documents: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'expired'],
    default: 'pending'
  },
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // stretchGoals: [{
  //   amount: Number,
  //   description: String,
  //   achieved: { type: Boolean, default: false }
  // }],
  impactUnit: {
    type: String,
    default: 'people helped'
  }
}, {
  timestamps: true
});

// Index for search
campaignSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Campaign', campaignSchema);