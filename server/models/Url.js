const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: String,

  shortCode: {
    type: String,
    unique: true,
    index: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  clicks: { type: Number, default: 0 },

  expireAt: {
    type: Date,
    index: { expires: 0 }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Url", urlSchema);
