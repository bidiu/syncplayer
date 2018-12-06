const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** user schema */
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 32
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 32,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32
  },
  age: {
    type: Number,
    min: 1,
  },
  sex: {
    type: String,
    match: /^(m|f)$/
  },
  avatarUrl: {
    type: String,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 32
  }
});

/** user model */
const User = mongoose.model('User', userSchema);

module.exports = User;
