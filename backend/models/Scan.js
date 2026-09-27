import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true,
    },
    trustScore: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk', 'Critical'],
      required: true,
    },
    reasons: [
      {
        label: {
          type: String,
          required: true,
        },
        passed: {
          type: Boolean,
          required: true,
        },
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
    rawFeatures: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    techStack: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Scan = mongoose.model('Scan', scanSchema);

export default Scan;
