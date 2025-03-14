import mongoose, { Schema } from "mongoose";

const routeSchema = new Schema(
  {
    testCentreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestCentre",
      required: true,
    },
    TestCentreName: {
      type: String,
      required: true,
    },
    expectedTime: {
      type: Number,
      required: true,
    },
    shareUrl: {
      type: String,
      required: true,
    },
    listOfStops: [{ type: String }],
    startCoordinator: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    isUser: {
      type: Boolean,
      default: false,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    passRate: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalRoute: {
      type: Number,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    favorite: [{ userId: { type: Schema.Types.ObjectId, ref: "Auth" } }],
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Auth" },
        value: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);
