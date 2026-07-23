require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(helmet());

const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

const allowedOrigins = new Set([clientUrl].filter(Boolean));

const localDevOriginRegex =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin header (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow common local development origins
      if (
        process.env.NODE_ENV === "development" &&
        localDevOriginRegex.test(origin)
      ) {
        return callback(null, true);
      }

      // Allow configured frontend URL
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Platform API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});