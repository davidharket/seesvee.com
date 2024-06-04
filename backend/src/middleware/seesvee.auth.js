const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization || req.query.token || req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY);
    req.stripeSessionID = decoded.stripeSessionID;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = verifyToken;
