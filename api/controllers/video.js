const videoService = require('../services/video');
const Res = require('../common/models/responses');

/**
 * GET /api/v1/videos/info/extract
 * 
 * Extract video info from page URL.
 */
async function extractVideoInfo(req, res) {
  let { pageUrl } = req.query;

  let data = await videoService.extractVideoInfo(pageUrl);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

/**
 * GET /api/v1/videos/title/extract
 * 
 * Extract video title from page URL.
 */
async function extractVideoTitle(req, res) {
  let { pageUrl } = req.query;

  let data = await videoService.extractVideoTitle(pageUrl);
  let payload = new Res.Ok({ data });
  res.status(payload.status).json(payload);
}

exports.extractVideoInfo = extractVideoInfo;
exports.extractVideoTitle = extractVideoTitle;
