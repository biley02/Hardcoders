const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    unique: true,
  },
  active: Boolean,
  description: {
    type: String,
  },
  skills: [
    {
      title: String,
      precent: Number,
    },
  ],
  goal: [
    {
      title: String,
      finished: Number,
      exam: String,
    },
  ],
  friends: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  tracks: [
    {
      type: ObjectId,
      ref: "Tracks",
    },
  ],
  notes: [
    {
      type: ObjectId,
      ref: "Note",
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
