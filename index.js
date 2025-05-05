require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  const apiKey = "AIzaSyAYJGwp3bKclMpln-viL7ZU1CMHhUiyGxU";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    geminiConfigured: !!apiKey,
  });
});

// API routes
app.use("/api/get_lesson", require("./pages/api/get_lesson"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
    path: req.path,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Access denied",
    });
  }

  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// Handle server startup errors
const server = app
  .listen(PORT, () => {
    const apiKey = "AIzaSyAYJGwp3bKclMpln-viL7ZU1CMHhUiyGxU";
    console.log(`Server is running on port ${PORT}`);
    console.log("Environment:", process.env.NODE_ENV || "development");
    console.log("Gemini API Key status:", apiKey ? "Configured" : "Missing");
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port.`
      );
      process.exit(1);
    } else {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  });
 