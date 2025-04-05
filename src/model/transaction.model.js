// models/Transaction.js
import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    providerId: { type: String, required: true },
    price: { type: Number, required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    testCentreId: { type: Schema.Types.ObjectId, ref: 'TestCentre', required: false },
    transactionDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);


