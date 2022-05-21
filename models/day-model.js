const mongoose = require("../connection");

const daySchema = new mongoose.Schema({
  mood: { type: String, required: true },
  date: { type: String, required: true },
  notes: {type: String},
  goalForToday: {type: String},
  goalDoneYesteryday: {type: Boolean}
});

const Day = mongoose.model("Day", daySchema);

module.exports = Day;