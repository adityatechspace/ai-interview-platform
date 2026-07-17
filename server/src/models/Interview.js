const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['ai', 'user'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    questionNumber: {
      type: Number,
    },
  },
  { _id: false, timestamps: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack', 'Software Engineer', 'Machine Learning', 'HR', 'Behavioral'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    language: {
      type: String,
      default: 'English',
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'Behavioral', 'Mixed'],
      required: true,
    },
    duration: {
      type: Number, // in minutes
      enum: [10, 20, 30],
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 8,
    },
    questions: {
      type: [String],
      default: [],
    },
    conversation: {
      type: [messageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    result: {
      overallScore: { type: Number, min: 0, max: 100 },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      feedback: { type: String },
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
