const path = require("path");

const express = require("express");
const cors = require("cors");
const hpp = require("hpp");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { webhookCheckout } = require("./services/orderService");

// Load environment variables from 'config.env'
dotenv.config({
  path: "config.env",
});

const databaseConnection = require("./config/database");
const AppError = require("./utils/appError");
const globalError = require("./middlewars/errorMiddleware");

// Import route modules
const mounteRoute = require("./routes/index");

// Connect to the database
databaseConnection();

// Create an instance of the Express application
const app = express();

//enable other domain to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//checkout session completed
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middleware setup
app.use(express.json({ limit: "20kb" }));

// Allow access to static files in the "uploads" directory
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// To apply data sanitization
app.use(mongoSanitize());

app.use(xss());

// Limit each Ip to 100 requests per 'window' (here, per 15 mintues)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});
app.use("/api/", apiLimiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Mount Routes
mounteRoute(app);

// Handle unmatched routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route:${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// Set up server to listen on specified port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server running in port ${port}`);
});

// Handle unhandled rejections outside of Express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
