import mongoose, {Schema} from "mongoose";

const contactUsSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ContactUs = mongoose.model("ContactUs", contactUsSchema);
