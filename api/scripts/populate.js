/*
 * Use this script to quickly populate data into database.
 */

const venueService = require('../services/venue');
const roomService = require('../services/room');

/**
 * Populate `venues` collection in database.
 */
async function populateVenues() {
  let venues = await venueService.index();

  // if already have data, don't populate more
  if (venues.length > 0) { return; }
  console.log('No document in `venues` collection, start populating.');

  venues = require('./venues.json');
  return Promise.all(venues.map(doc => venueService.create(doc)));
}

async function populateRooms() {
  let rooms = await roomService.index();

  // if already have data, don't populate more
  if (rooms.length > 0) { return; }
  console.log('No document in `rooms` collection, start populating.');

  rooms = require('./rooms.json');
  return Promise.all(rooms.map(doc => roomService.create(doc)));
}

async function populate() {
  try {
    await populateVenues();
    await populateRooms();

  } catch (err) {
    console.error('Error while pupulating documents to MongoDB. Reason:\n', err);
  }
}

populate();
