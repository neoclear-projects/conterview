const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemSetSchema = new Schema({
  belongingUserId: {
    type: String,
    required: 'belonging user ID is required',
  },
  problems: {
    type: Array,
    required: 'problems are required',
  }
});

const ProblemSet = mongoose.model('Problem Set', problemSetSchema);

module.exports = ProblemSet;