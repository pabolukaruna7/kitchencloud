const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded:", decoded);

      // Get user from token
      req.user = await User.findById(decoded.id);
      console.log("User found:", req.user ? req.user.email : "No user");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No user found with this token",
        });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "Auth middleware error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = auth;
