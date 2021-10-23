const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required,
  },
  description: {
    type: String,
  },
  contentURL: {
    type: String,
  },
  author: {
    type: ObjectId,
    ref: "User",
    required,
  },
});
module.exports = mongoose.model("Note", noteSchema);
