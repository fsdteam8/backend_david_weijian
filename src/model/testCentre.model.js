import mongoose, { Schema } from "mongoose";

const TestCentreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    passRate: {
      type: Number,
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
      required: true
    },
  },
  { timestamps: true }
);

TestCentreSchema.index({
  name: 1,
  postCode: 1
});

export const TestCentre = mongoose.model("TestCentre", TestCentreSchema);
