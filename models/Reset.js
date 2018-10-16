const mongoose = require("mongoose");
const resetExpiry = require("../config/serverconfig").resetExpiry;
const Schema = mongoose.Schema;
const generateToken = require("../utils/generateToken");

const resetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    default: () => generateToken(32)
  },
  exp: {
    type: Date,
    default: () => Date.now() + resetExpiry * 1000
  },
  otp: {
    type: String,
    required: true
  },
  remainingAttempts: {
    type: Number,
    default: 3
  }
});

module.exports = User = mongoose.model("resets", resetSchema);
