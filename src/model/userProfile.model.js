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
    dateOfBirth: {
        type: Date,
        required: true
    }
    
});

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);