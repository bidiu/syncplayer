const roomService = require('../services/room');
const videoService = require('../services/video');
const Res = require('../common/models/responses');
const { compressDoc } = require('../utils/common');

/**
 * POST /api/v1/rooms
 * 
 * Create a room.
 * 
 * Either client provides `pageUrl`, or provides `videoUrl` & 
 * `videoType`. If client provides both, `videoUrl` & `videoType`
 * take precedence.
 */
async function create(req, res) {
  let { videoUrl, videoType, pageUrl } = req.body;
  let doc = compressDoc({ videoUrl, videoType, pageUrl });

  if (!doc.videoUrl) {
    let videoInfo = await videoService.extractVideoInfo(pageUrl);
    doc.videoUrl = videoInfo.url;
    doc.videoType = videoInfo.type;
    doc.videoPosterUrl = videoInfo.posterUrl;
    doc.pageTitle = videoInfo.title;
  } else if (pageUrl) {
    doc.pageTitle = await videoService.extractVideoTitle(pageUrl);
  }

  let data = await roomService.create(doc);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
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
