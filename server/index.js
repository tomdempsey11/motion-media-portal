const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Needed on most hosts (Render/Railway/etc.) so secure cookies work properly
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

const isProd = process.env.NODE_ENV === "production";

// ✅ Allow both localhost + deployed frontend (from env var)
const allowedOrigins = [
  process.env.CLIENT_ORIGIN, // e.g. https://your-frontend.netlify.app
  "http://localhost:3000",
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.path);
  res.setHeader("X-MotionMedia-API", "true");
  next();
});

// Sessions (stored in MongoDB) ✅ MUST be before routes that need req.session
app.use(
  session({
    name: "motionmedia.sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: isProd, // ✅ true in production (HTTPS)
      sameSite: isProd ? "none" : "lax", // ✅ allow cross-site cookies in prod
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use("/api/admin", require("./routes/admin"));

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Motion Media API is running" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
