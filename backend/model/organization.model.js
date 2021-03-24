const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: String,
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;