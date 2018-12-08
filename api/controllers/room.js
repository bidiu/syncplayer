const roomService = require('../services/room');
const Res = require('../common/models/responses');
// const ApiError = require('../common/models/api-errors');
// const { compressDoc } = require('../utils/common');

async function create(req, res) {
  // TODO
}

/**
 * GET /api/v1/rooms/:roomId
 * 
 * Retrieve a room.
 */
async function retrieve(req, res) {
  let roomId = req.params.roomId;

  let data = await roomService.retrieve(roomId);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

exports.retrieve = retrieve;
exports.create = create;
