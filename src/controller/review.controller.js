import { Review } from "../model/review.model.js";

const createReview = async (req, res) => {
  try {
    const { routeId, reviewText } = req.body;
    const userId = req.user._id;
    const review = new Review({
      routeId,
      userId,
      reviewText,
    });

    if (!review){
        return res.status(400).json({ status: false, message: "Please fill up properly" });
    }

    await review.save();
    return res.status(201).json({ status: true, message: "Review created successfully", data: review });

  } catch (error) {
    console.log("Error creating review", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export {
    createReview
}
