const AppError = require("../utils/appError");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvaildSignature = () =>
  new AppError("Invalid token, please login again", 401);

const handleJwtExpiredError = () =>
  new AppError("Invalid token, please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvaildSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpiredError();

    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
