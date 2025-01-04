// models/teacherApplication.js

import mongoose from 'mongoose';

const QualificationSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    match: [/^\d{4}$/, 'Year must be a 4-digit number'],
  },
  description: {
    type: String,
    required: true,
  },
});

const TeacherApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    qualifications: {
      type: [QualificationSchema],
      required: [true, 'Qualifications are required'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
    },
    expertise: {
      type: [String],
      required: [true, 'Areas of expertise are required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent recompilation of model in development
export default mongoose.models.TeacherApplication ||
  mongoose.model('TeacherApplication', TeacherApplicationSchema);
