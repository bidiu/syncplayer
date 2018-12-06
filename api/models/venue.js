const mongoose = require('mongoose');
const {genStaticMapUrl } = require('../utils/geo');

const Schema = mongoose.Schema;

/** venue schema */
const venueSchema = new Schema({
  // a title (name)
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 64
  },
  // venue's type
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32,
  },
  // main thumbnal's url
  imgUrl: {
    type: String,
    minlength: 1  
  },
  // about this place
  about: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2048
  },
  // contact info
  phone: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 16
  },
  // contact info
  email: {
    type: String,
    minlength: 4,
    maxlength: 32
  },
  // min num of customers
  minCustomers: {
    type: Number,
    min: 1,
  },
  // max num of customers
  maxCustomers: {
    type: Number,
    min: 1
  },
  // loction
  zip: {
    type: String,
    minlength: 1,
    maxlength: 16
  },
  // human readabel address
  address: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 64
  },
  coordinate: {
    type: [Number],
    required: true,
    index: '2dsphere'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

venueSchema.virtual('staticMapUrl').get(function () {
  return genStaticMapUrl(this.address || this.zip);
});

venueSchema.index({ name: 'text', about: 'text' });

/** venue model */
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
