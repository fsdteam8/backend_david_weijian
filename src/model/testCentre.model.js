import mongoose, { Schema } from "mongoose";

const TestCentreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    passRate: {
      type: String,
      required: true,
    },
    routes: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const TestCentre = mongoose.model("TestCentre", TestCentreSchema);
