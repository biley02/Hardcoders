const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Note", noteSchema);
