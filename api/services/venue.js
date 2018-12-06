const Venue = require('../models/venue');
const ApiError = require('../common/models/api-errors');
const { geocodeAddress } = require('../utils/geo');

const fields = `name type imgUrl about phone email minCustomers maxCustomers zip address coordinate`;

const defaultSort = { _id: 1 };

/**
 * TODO index based on tag, geo
 */
async function index(filters = {}, { sort = defaultSort, limit = 12, projection = fields } = {}) {
  return Venue.find(filters, projection, { sort, limit });
}

/**
 * Fake implementation right now.
 * 
 * @param {*} userId 
 */
async function indexBooked(userId) {
  let venues = await index({}, { limit: 3 });
  venues = venues.map(v => v.toObject());
  let dates = [
    new Date('2018-07-29T17:30:00'),
    new Date('2018-08-02T19:00:00'),
    new Date('2018-08-04T20:00:00')
  ];

  let i = 0;
  for (let venue of venues) {
    venue.bookedTime = dates[i].getTime();
    i++;
  }
  return venues;
}

async function retrieve(venueId, projection = fields) {
  let venue = await Venue.findById(venueId, projection);
  
  if (venue) { return venue; }
  throw new ApiError.NotFound();
}

async function create(doc) {
  // coordinate
  let coded = await geocodeAddress(doc.address, doc.zip);
  doc = { ...doc, coordinate: [coded.lng, coded.lat] };

  return Venue.create(doc);
}

/**
 * TODO update geolocation (longitude and latitude).
 */
async function update(doc) {
  let venue = await retrieve(doc._id);

  await venue.update(doc);
  return retrieve(doc._id);
}

exports.index = index;
exports.indexBooked = indexBooked;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
