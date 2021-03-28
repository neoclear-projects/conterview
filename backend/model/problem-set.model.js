const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemSetSchema = new Schema({
  belongingUserId: {
    type: String,
    required: 'belonging user ID is required',
  },
  belongingOrgId: {
    type: String,
    required: 'belonging user ID is required',
  },
  problemName:{
    type: String,
    required: 'Problem Name is required',
  },
  description:{
    type: String,
    required: 'Problem description is required',
  },
  correctRate:{
    type: Number,
    required: 'Problem correct rate is required',
  },
  preferredLanguage:{
    type: String,
    required: 'Problem preferred Language is required',
  },
  starterCodes:{
    type: Array,
    required: 'Problem starter codes is required',
  },
  problemInputSet:{
    type: Array,
    required: 'Problem Input Set is required',
  },
  problemOutputSet:{
    type: Array,
    required: 'Problem Output Set is required',
  },
  problemRubric:[
    {
      name:String, 
      desc:String,
      rating:Number,
      curRating:{
        type:Number,
        default:0
      }
    }
  ]
});

const ProblemSet = mongoose.model('ProblemSet', problemSetSchema);

exports.ProblemSet = ProblemSet;
exports.ProblemSetSchema = problemSetSchema;