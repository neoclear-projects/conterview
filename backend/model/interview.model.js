const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InterviewSchema = new Schema({
  candidate: {
    name: String,
    email: String,
  },
  interviewerIds: [ObjectId],
  problemIds: [ObjectId],
  positionId: ObjectId,
  organizationId: ObjectId,
  time: Date,
  status: String,
  length: Number,
});

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;