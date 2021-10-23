const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required,
  },
  description: {
    type: String,
  },
  resource: [
    {
      type: ObjectId,
      ref: "Resource",
    },
  ],
});
module.exports = mongoose.model("Track", trackSchema);
