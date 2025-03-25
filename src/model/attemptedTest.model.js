import mongoose, { Schema } from "mongoose";

const AttemptedTestSchema = new Schema(
    {
        passRate: {
            type: Number,
            default: 0
        },
        testCentreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TestCentre",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth"
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route"
        },
        isCompleted: {
            type: Boolean
        },
    },
    { timestamps: true }
);

export const AttemptedTest = mongoose.model("AttemptedTest", AttemptedTestSchema);
