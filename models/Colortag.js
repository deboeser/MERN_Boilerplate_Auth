const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colortagSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  tagname: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  background: {
    type: String
  },
  underlined: {
    type: Boolean,
    required: true
  },
  bold: {
    type: Boolean,
    required: true
  },
  bigger: {
    type: Boolean,
    required: true
  },
  phrases: [
    {
      type: String
    }
  ],
  subscribed: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model("colortags", colortagSchema);
