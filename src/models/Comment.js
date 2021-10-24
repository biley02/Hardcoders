const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: String,
  rating: Number,
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);
