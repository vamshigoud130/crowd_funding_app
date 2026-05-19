import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String,
    required: true
  },
  referralId: {
    type: String
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Donation', donationSchema);