const verifyToken = (req, res, next) => {
  const token = req.session.jwt;
  console.log(req.session);

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  });
};

module.exports = verifyToken;
