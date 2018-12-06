const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** feedback schema */
const feedbackSchema = new Schema({
  
  feedbackTitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32
  },

  feedbackContent: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200
  }

  
});


/** feedback model */
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
