const venueService = require('../services/venue');
const Res = require('../common/models/responses');
const ApiError = require('../common/models/api-errors');
const { compressDoc } = require('../utils/common');
const { parseCoordinateStr } = require('../utils/geo');

// TODO hardcoded here
const venueTypes = [
  { text: 'restaurant', img: '/img/type_restaurant.jpg' },
  { text: 'escape room', img: '/img/type_escape.jpg' },
  { text: 'entertainment', img: '/img/type_entertainment.jpg' },
  { text: 'boardroom', img: '/img/type_boardroom.jpg' },
  { text: 'family', img: '/img/type_family.jpg' },
  { text: 'experience', img: '/img/type_experience.png' },
  { text: 'nature', img: '/img/type_nature.jpg' },
  { text: 'learning', img: '/img/type_learning.jpg' }
];

// parse sort query param
function _parseSort(paramVal) {
  let entries = paramVal.split('|');
  let sort = {};

  for (let entry of entries) {
    let matches = entry.match(/^(\w+):(-?1)$/);
    if (!matches) { throw new ApiError.BadReq({ details: 'Invalid `sort` param.' }); }

    sort[matches[1]] = parseInt(matches[2]);
  }

  if (!sort._id) {
    throw new ApiError.BadReq({ details: 'Sort must contain `_id`.' });
  }
  if (Object.entries(sort).length > 2) {
    throw new ApiError.BadReq({ details: 'Too many sort fields (maximum 2 including `_id`).' });
  }

  return sort;
}

// return filters
function mapSortToFilters(sort, lastId, lastVal) {
  if (typeof lastId !== 'string') {
    throw new ApiError.BadReq({ details: 'Invalid `lastId`.' });
  }
  if (Object.entries(sort).length !== [lastId, lastVal].filter(e => e !== undefined).length) {
    throw new ApiError.BadReq({ details: 'Invalid combination of `sort`, `lastId` and `lastVal`.' });
  }

  let idfilter = { _id: sort._id > 0 ? { $gt: lastId } : { $lt: lastId } };

  if (lastVal === undefined) {
    // only sorted by _id
    return idfilter;
  }

  // sorted by two fields, including `_id`
  let field = Object.keys(sort).filter(k => k !== '_id')[0];
  let order = sort[field];

  return {
    $or: [
      { [field]: order > 0 ? { $gt: lastVal } : { $lt: lastVal } },
      { [field]: lastVal, ...idfilter }
    ]
  };
}

/**
 * GET /api/v1/venues
 * 
 * Index venues.
 */
async function index(req, res) {
  let {
    type, name, center, distance, sort, limit, lastVal, lastId
  } = req.query;
  if (type === 'all') { type = undefined; }
  let filters = {};

  // type
  if (type) {
    if (!venueTypes.map(t => t.text).includes(type)) {
      throw new ApiError.BadReq({ details: 'Invalid venue type.' });
    }
    filters.type = type;
  }
  // name
  if (name) {
    filters.$text = { $search: name }
  }
  // distance
  if (center && distance && !isNaN(distance)) {
    try {
      center = parseCoordinateStr(center);
    } catch (err) { throw new ApiError.BadReq(); }

    filters.coordinate = {
      $geoWithin: { $centerSphere: [[center.lng, center.lat], distance / 6378.1] }
    }
  }

  // sort
  if (sort) { sort = _parseSort(sort); }
  // limit
  if (limit) { limit = parseInt(limit); }

  if (lastId !== undefined) {
    // include sort-related filters (if necessary)
    filters = { $and: [filters, mapSortToFilters(sort, lastId, lastVal)] };
  }

  let data = await venueService.index(filters, { sort, limit });
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

/**
 * GET /api/v1/venues/:venuesId
 * 
 * Retrieve a venue.
 */
async function retrieve(req, res) {
  let venueId = req.params.venueId;

  let data = await venueService.retrieve(venueId);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

/**
 * POST /api/v1/venues
 * 
 * Create a venue.
 */
async function create(req, res) {
  let {
    name, type, imgUrl, about, phone, email, 
    minCustomers, maxCustomers, zip, address
  } = req.body;

  let doc = compressDoc({
    name, type, imgUrl, about, phone, email, 
    minCustomers, maxCustomers, zip, address
  });

  let data = await venueService.create(doc);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

/**
 * PATCH /api/v1/venues/:venueId
 * 
 * Update a venue.
 */
async function update(req, res) {
  let _id = req.params.venueId;
  let {
    name, type, imgUrl, about, phone, email, 
    minCustomers, maxCustomers, zip, address 
  } = req.body;

  let doc = compressDoc({
    _id, name, type, imgUrl, about, phone, email,
    minCustomers, maxCustomers, zip, address
  });

  let data = await venueService.update(doc);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

async function indexTypes(req, res) {
  let { complete = false } = req.query;

  let data = complete ? venueTypes : venueTypes.map(t => t.text);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

async function indexBooked(req, res) {
  let { userId } = req.query;

  let data = await venueService.indexBooked(userId);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.indexTypes = indexTypes;
exports.indexBooked = indexBooked;
