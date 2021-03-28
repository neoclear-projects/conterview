const mongoose = require('mongoose');
const ProblemSetSchema = require('./problem-set.model').ProblemSetSchema;

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InterviewSchema = new Schema({
  candidate: {
    name: String,
    email: String,
  },
  interviewers: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  problems: [
    {
      type: ObjectId,
      ref: 'ProblemSet'
    }
  ],
  problemsSnapshot: [ProblemSetSchema],
  position: {
    type: ObjectId,
    ref: 'Position'
  },
  organizationId: ObjectId,
  scheduledTime: Date,
  startTime: Date,
  finishTime: Date,
  status: String,
  scheduledLength: Number,
  currentProblemIndex: Number,
});

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;