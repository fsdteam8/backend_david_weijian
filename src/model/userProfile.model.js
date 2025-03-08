import mongoose, {Schema} from "mongoose";

const userProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    
});

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);