const jwt = require('jsonwebtoken');

// Generate Access Token
exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m', // Short expiration for access token
  });
};

// Generate Refresh Token
exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d', // Longer expiration for refresh token
  });
};
