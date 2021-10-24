const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tracksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  tracktitle: [
    {
      type: String,
    },
  ],
  trackdescription: [
    {
      type: String,
    },
  ],
  trackresource: [
    {
      type: String,
    },
  ],
  visibility: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Tracks", tracksSchema);
