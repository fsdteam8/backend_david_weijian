import mongoose, {Schema} from "mongoose";

const RouteSchema = new Schema(
  {
    testCenterId: {
      type: Schema.Types.ObjectId,
      ref: "TestCenter",
      required: true,
    },
    startingPoint: {
      type: String,
      required: true,
    },
    endingPoint: {
      type: String,
      required: true,
    },
    startCoordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    endCoordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    mapUrl: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    shareUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RouteCentre = mongoose.model("RouteCentre", RouteSchema);
