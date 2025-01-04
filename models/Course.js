// models/Course.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Lesson Schema
const LessonSchema = new Schema({
  lessonTitle: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
  videoURL: { type: String },
});

// Module Schema
const ModuleSchema = new Schema({
  moduleTitle: { type: String, required: true },
  lessons: [LessonSchema],
});

// Course Schema
const CourseSchema = new Schema(
  {
    category: { type: String, required: true },
    subcategory: { type: String },
    courseTitle: { type: String, required: true }, 
    courseDescription: { type: String },           
    whatYouWillLearn: [{ type: String }],         
    modules: [ModuleSchema],
    price: { type: Number, required: true },
    priceId: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    }, 
  },
  { timestamps: true }
);

// Indexes
CourseSchema.index({ category: 1 });
CourseSchema.index({ subcategory: 1 });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
