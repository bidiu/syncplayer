const Room = require('../models/room');
const ApiError = require('../common/models/api-errors');

const fields = `videoUrl videoType pageUrl createdAt updatedAt`;
const defaultSort = { _id: 1 };

async function index(filters = {}, { sort = defaultSort, limit = 20, projection = fields } = {}) {
  return Room.find(filters, projection, { sort, limit });
}

async function retrieve(id, projection = fields) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    let room = await Room.findById(id, projection);
    if (room) { return room; }
  }
  throw new ApiError.NotFound();
}

async function create(doc) {
  let room = await Room.create(doc);
  return retrieve(room.id);
}

exports.create = create;
exports.retrieve = retrieve;
exports.index = index;
