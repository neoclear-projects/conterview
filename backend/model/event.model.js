const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EventSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  action: String,
  itemTypeRef: String,
  itemType: String,
  item1: {
    _id: ObjectId,
    name: String,
  },
  item2: {
    _id: ObjectId,
    name: String,
  },
  time: Date,
  organizationId: ObjectId,
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;