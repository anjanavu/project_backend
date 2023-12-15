
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  batchName: {
    type: String,
    required: true
  },
  exitTestDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const batches = mongoose.model('batches', batchSchema);

module.exports = batches;
