// models/UserCourseProgress.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Lecture Schema
const LectureSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String },
  videoId: { type: String },
  videoURL: { type: String },
  completed: { type: Boolean, default: false },
});

// Section Schema
const SectionSchema = new Schema({
  sectionTitle: { type: String, required: true },
  lectures: [LectureSchema],
});

// Progress Schema
const ProgressSchema = new Schema({
  curriculum: [SectionSchema],
  percentage: { type: Number, default: 0 },
});

// UserCourseProgress Schema
const UserCourseProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: ProgressSchema,
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for efficient querying
UserCourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.UserCourseProgress ||
  mongoose.model('UserCourseProgress', UserCourseProgressSchema);
