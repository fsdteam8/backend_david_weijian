import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    month: { type: Number, required: true },
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    testCentreId: { type: Schema.Types.ObjectId, ref: 'TestCentre', required: false },
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);


