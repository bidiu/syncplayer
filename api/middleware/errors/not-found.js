const Res = require('../../common/models/responses');

module.exports = function (req, res, next) {
  let payload = new Res.NotFound();
  res.status(payload.status).json(payload);
};
