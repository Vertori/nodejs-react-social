const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized, token is missing!");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    req.user = decoded.user; // or just decoded
    next();
  });
});

module.exports = validateToken;
