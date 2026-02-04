const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
   if(!user) return res.status(400).json({ error:"invalid" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ Create session in MongoDB
    req.session.userId = user._id;

    res.json({
      message: "Login successful",
      user: {
        id: user._id, 
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
