const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  sender: { type: String, enum: ["user", "ai"] },
  message: {type : String } ,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
