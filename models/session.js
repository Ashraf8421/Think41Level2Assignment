const mongoose = require("mongoose");
const Schema = mongoose.Schema

const sessionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionName: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
