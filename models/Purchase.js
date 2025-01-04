import mongoose from 'mongoose';

const { Schema } = mongoose;

const PurchaseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'SGD' },
    status: { type: String, default: 'succeeded' },
  },
  { timestamps: true }
);

// Indexes
PurchaseSchema.index({ user: 1 });
PurchaseSchema.index({ course: 1 });
PurchaseSchema.index({ paymentIntentId: 1 }, { unique: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
