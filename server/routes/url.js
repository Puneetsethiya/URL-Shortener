const express = require("express");
const Url = require("../models/Url");
const auth = require("../middleware/auth");

const router = express.Router();


// ----------------------
// Generate short code
// ----------------------
function generateShortCode(length = 4) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}


// ----------------------
// CREATE SHORT URL
// ----------------------
router.post("/shorten", auth, async (req, res) => {
  try {
    const { originalUrl, customCode, expiry } = req.body;

    let shortCode = customCode || generateShortCode();

    // avoid duplicates
    while (await Url.findOne({ shortCode })) {
      shortCode = generateShortCode();
    }

    // expiry calculation
    let expireAt = null;
    const now = new Date();

    if (expiry === "10min")  expireAt = new Date(now.getTime() + 10 * 60000);
    if (expiry === "1hour")  expireAt = new Date(now.getTime() + 60 * 60000);
    if (expiry === "1day")   expireAt = new Date(now.getTime() + 24 * 60 * 60000);
    if (expiry === "7days")  expireAt = new Date(now.getTime() + 7 * 24 * 60 * 60000);
    // "never" => null

    const url = new Url({
      originalUrl,
      shortCode,
      expireAt,
      user: req.session.userId
    });

    await url.save();

    res.json(url);

  } catch (err) {
    console.error("SHORTEN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------------
// GET USER LINKS
// ----------------------
router.get("/myurls", auth, async (req, res) => {
  try {
    const urls = await Url.find({
      user: req.session.userId
    }).sort({ createdAt: -1 });

    res.json(urls || []);

  } catch (err) {
    console.error("MYURLS ERROR:", err);
    res.json([]);
  }
});


// ----------------------
// DELETE USER LINK
// ----------------------
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!url) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------------
// REDIRECT + TRACK
// ----------------------
router.get("/:code", async (req, res) => {
  try {

    const url = await Url.findOneAndUpdate(
      { shortCode: req.params.code },
      {
        $inc: { clicks: 1 },
        $push: {
          analytics: {
            ip: req.ip,
            userAgent: req.headers["user-agent"]
          }
        }
      },
      { new: true }
    );

    if (!url) return res.send("Short URL not found");

    res.redirect(url.originalUrl);

  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
