const mongoose = require("mongoose");

const FrameSchema = new mongoose.Schema({
  name: String,
  googleid: String,
});

// compile model from schema
module.exports = mongoose.model("frame", FrameSchema);