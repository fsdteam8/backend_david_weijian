import mongoose, { Schema } from "mongoose";

const bugReportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    screenName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const BugReport = mongoose.model("BugReport", bugReportSchema);
