const cookie = require("cookie");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.origin === process.env.VUE_APP_APP_DEV_URL) {
    next();
    return;
  }

  const cookies = cookie.parse(req.headers.cookie || ""); // Parse the cookies from the request

  if (!cookies["emailer/jwt"]) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const token = cookies["emailer/jwt"];

  jwt.verify(token, process.env.VUE_APP_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token"
      });
    }

    next();
  });
};
