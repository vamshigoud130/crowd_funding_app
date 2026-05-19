import mongoose from 'mongoose';

const fraudLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  reasons: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['flagged', 'cleared', 'investigating'],
    default: 'flagged'
  }
}, {
  timestamps: true
});

export default mongoose.model('FraudLog', fraudLogSchema);