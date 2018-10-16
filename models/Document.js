const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  doi: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  abstract: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("documents", documentSchema);
