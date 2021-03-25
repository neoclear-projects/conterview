const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InterviewSchema = new Schema({
  candidate: {
    name: String,
    email: String,
  },
  interviewers: [
    {
      _id: ObjectId,
      username: String
    }
  ],
  problems: [
    {
      _id: ObjectId,
      problemName: String
    }
  ],
  position: {
    _id: ObjectId,
    name: String
  },
  organizationId: ObjectId,
  scheduledTime: Date,
  startTime: Date,
  finishTime: Date,
  status: String,
  scheduledLength: Number,
});

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;