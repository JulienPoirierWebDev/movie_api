const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.session.jwt;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = decodedToken;

    next();
  });
};

module.exports = verifyToken;
