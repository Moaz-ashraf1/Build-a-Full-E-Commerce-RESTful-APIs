const path = require("path");

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const morgan = require("morgan");

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

// Middleware setup
app.use(express.json());
// Allow access to static files in the "uploads" directory
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
mounteRoute(app);
// Handle unmatched routes
app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route:${req.originalUrl}`, "400"));
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
