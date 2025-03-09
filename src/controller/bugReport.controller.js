import { BugReport } from "../model/bugReport.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.util.js";

const submitBugReport = async (req, res) => {
  try {
    const { project, screenName, message } = req.body;

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }

    // Validate required fields
    if (!project || !screenName || !message) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    // Check if an image is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage) {
      return res
        .status(500)
        .json({
          status: false,
          message: "Failed to upload image to Cloudinary",
        });
    }

    // Create bug report object
    const bugReport = new BugReport({
      project,
      screenName,
      message,
      image: uploadedImage.secure_url,
      user: req.user._id,
    });

    await bugReport.save();

    return res.status(201).json({
      status: true,
      message: "Bug report submitted successfully",
      bugReport,
    });
  } catch (error) {
    console.error("Error while submitting bug report: ", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export { submitBugReport };
