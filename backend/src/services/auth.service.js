const jwt = require("jsonwebtoken");
const axios = require("axios");
const https = require("https");

const SECRET_KEY = process.env.SECRET_KEY;

// Login to otsuka api
const loginAPI = async (username, password) => {
  let res = await axios
    .post(
      process.env.AUTH_URL,
      { username, password },
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    )
    .catch((err) => console.log(err));
  if (res.status) {
    return res.data;
  } else {
    return false;
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn: "24h" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) token = token.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
  loginAPI,
};
