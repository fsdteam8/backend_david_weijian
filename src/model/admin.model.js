import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    permissions: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
