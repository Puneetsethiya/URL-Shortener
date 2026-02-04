require("dotenv").config({ quiet: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes/url");
const authRoutes = require("./routes/auth");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

// IMPORTANT for Render / proxies
app.set("trust proxy", 1);

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  })
);

app.use(express.json());

// SESSION
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true
    }
  })
);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// ROUTES
app.use("/auth", authRoutes);
app.use("/", routes);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.send("OK");
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
