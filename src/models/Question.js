const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
  },
  category: {
    type: String,
  },
  tags: {
    type: String,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: ObjectId,
      ref: "Comment",
    },
  ],
});
module.exports = mongoose.model("Question", questionSchema);
