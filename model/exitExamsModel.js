
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exitExamsSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  phone: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'batches',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'students',
    required: true
  },
  result:{
    type: Number,
    required: false
  }
  
}, {collection:'exitExams'});

const exitExams = mongoose.model('exitExams', exitExamsSchema);

module.exports = exitExams;