import jwt from "jsonwebtoken";
import { Auth } from "../model/auth.model.js";

// Middleware to verify JWT token
const verifyJWT = async (req, res, next) => {
  // Skip the check for routes that don't require authentication
  if (req.method === 'POST' && (req.url === '/login' || req.url === '/register')) {
    return next();
  }

  try {
    const authHeader = req.header("Authorization");

    // If the header is missing or doesn't start with 'Bearer ', skip the token validation
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        status: false,
        message: "Authorization header missing or invalid.",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by decoded token and exclude password
    const user = await Auth.findById(decodedToken?._id).select("-password");

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }

    // Add user to req object to use in other routes
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export { verifyJWT };
