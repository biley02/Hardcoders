const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  img: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  cover: String,
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
  url: {
    type: String,
  },
});
module.exports = mongoose.model("Resource", resourceSchema);
