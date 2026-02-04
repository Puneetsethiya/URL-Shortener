require("dotenv").config({ quiet: true });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes/url");
const authRoutes = require("./routes/auth");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}));


app.use(express.json());

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ROUTES
app.use("/auth", authRoutes);
app.use("/", routes);

// HEALTH CHECK
app.get("/health", (req, res) => res.send("OK"));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
