import mongoose, { Schema } from "mongoose";

const routeSchema = new Schema(
  {
    testCentreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestCentre",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth"
    },
    routeName: {
      type: String
    },
    TestCentreName: {
      type: String
    },
    expectedTime: {
      type: Number
    },
    shareUrl: {
      type: String
    },
    listOfStops: [{ lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }, { lat: Number, lng: Number }],
    startCoordinator: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    endCoordinator: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    isUser: {
      type: String,
      default: "user",
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
    view: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        rating: { type: Number, default: 0 },
        reviewMessage: { type: String, default: "" },
        userId: {
          type: Schema.Types.ObjectId, ref: "Auth"
        }
      }
    ],
    favorite: [{ userId: { type: Schema.Types.ObjectId, ref: "Auth" } }],
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);
