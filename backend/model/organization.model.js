"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: String,
  salt: String,
  saltedHash: String,
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;