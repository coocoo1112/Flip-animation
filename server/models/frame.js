const mongoose = require("mongoose");

const FrameSchema = new mongoose.Schema({
  user: String,
  projectId: String,
  link: String,
});

// compile model from schema
module.exports = mongoose.model("frame", FrameSchema);