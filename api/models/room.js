const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** venue schema */
const roomSchema = new Schema({
  videoUrl: {
    type: String,
    required: true,
    minlength: 1
  },
  videoType: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 16
  },
  pageUrl: {
    type: String,
    minlength: 1
  },
  pageTitle: {
    type: String,
    minlength: 1
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/** room model */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
