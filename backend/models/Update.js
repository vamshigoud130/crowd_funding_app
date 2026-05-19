import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  media: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Update', updateSchema);