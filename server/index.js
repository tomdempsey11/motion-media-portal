const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
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
      secure: false,
      sameSite: "lax",
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
