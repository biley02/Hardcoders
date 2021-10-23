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
  tracks: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      resource: [
        {
          name: String,
          url: String,
        },
      ],
    },
  ],
  visibility: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Tracks", tracksSchema);
