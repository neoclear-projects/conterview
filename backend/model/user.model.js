"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  saltedHash: String,
  salt: String,
  email: {
    type: String,
    unique: true,
  },
  organizationId: ObjectId,
  department: String,
  title: String,
  personalStatement: String,
  avatar: Object,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
