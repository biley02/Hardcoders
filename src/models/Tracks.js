const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tracksSchema = new mongoose.Schema({
  title: {
    type: String,
    required,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required,
  },
  track: [
    {
      type: ObjectId,
      ref: "Track",
    },
  ],
  visibility: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Tracks", tracksSchema);
