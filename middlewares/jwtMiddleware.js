const jwt = require("jsonwebtoken");

const showFlashMessages = require("../utils/messageUtils");
const httpStatusCode = require("../utils/httpStatusCode");

// Middleware to authenticate JWT Tokens
const authenticateJWT = (req, res, next) => {
  const token =
    req.cookies.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return showFlashMessages({
      req,
      res,
      message: "Access denied. Please log in.",
      status: httpStatusCode.UNAUTHORIZED,
      redirectUrl: "/users/login",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return showFlashMessages({
          req,
          res,
          message: "Session has expired. Please log in again.",
          status: httpStatusCode.UNAUTHORIZED,
          redirectUrl: "/users/login",
        });
      }

      return showFlashMessages({
        req,
        res,
        message: "Invalid token. Please log in again.",
        status: httpStatusCode.UNAUTHORIZED,
        redirectUrl: "/users/login",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateJWT;