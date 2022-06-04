const mongoose = require("../connection");

const tapSchema = new mongoose.Schema({
  user: {type: String, required: true},
  tap: {type: String, required: true}
});



const Tap = mongoose.model("Tap", tapSchema);

module.exports = Tap;

