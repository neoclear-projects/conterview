const mongoose = require('mongoose');

function toObjectId(_id){
	return new mongoose.Types.ObjectId(_id);
}

module.exports = toObjectId;