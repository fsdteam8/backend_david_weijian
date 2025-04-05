import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    month: { type: String, required: true },
    title: { type: String, required: true },
}, { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);


