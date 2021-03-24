const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PositionSchema = new Schema({
  name: String,
  userId: ObjectId,
  description: String,
  organizationId: ObjectId,
  pendingInterviewNum: Number,
  finishedInterviewNum: Number,
});

const Position = mongoose.model('Position', PositionSchema);

module.exports = Position;