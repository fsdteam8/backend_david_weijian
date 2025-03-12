import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  reviewText: { type: String, required: true },
});

export const Review = mongoose.model('Review', reviewSchema);
