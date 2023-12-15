
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  exitTestConfirmation: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
  // ,
  // batchId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'batches',
  //   required: true
  // }
});

const Student = mongoose.model('students', studentSchema);

module.exports = Student;
