const mongoose = require("../connection");

const daySchema = new mongoose.Schema({
  user: {type: String, required: true},
  mood: { type: String, required: true },
  date: { type: String, required: true },
  note: {type: String},
  goalForToday: {type: String},
  goalDone: {type: Boolean}
});



const Day = mongoose.model("Day", daySchema);

module.exports = Day;

