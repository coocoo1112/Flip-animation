const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: String,
  user: String,
  frameOrder: [String],
});

// compile model from schema
module.exports = mongoose.model("project", ProjectSchema);