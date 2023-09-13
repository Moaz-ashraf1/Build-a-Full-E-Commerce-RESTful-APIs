const JWT = require("jsonwebtoken");

const createToken = (payload) => {
  const token = JWT.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });

  return token;
};

module.exports = createToken;
