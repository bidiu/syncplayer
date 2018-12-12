const ApiError = require('../../common/models/api-errors');
const Res = require('../../common/models/responses');
const env = require('../../env/env');

const ERROR_MAP = new Map([
  [ApiError.CorsPolicy, Res.NoContent],
  [ApiError.BadReq, Res.BadReq],
  [ApiError.BadAuthentication, Res.UnAuth],
  [ApiError.NotFound, Res.NotFound],
  [ApiError.InternalErr, Res.ServerErr],
  [ApiError.NoAuthorization, Res.Forbidden],
  [ApiError.NotImplemented, Res.NotImplemented]
]);

module.exports = function (err, req, res, next) {
  if (!(err instanceof ApiError)) {
    next(err);
    return;
  }

  let resType = ERROR_MAP.get(err.constructor);
  let payload = null;

  if (!resType) {
    let details = `No response is defined for this error: ${err.constructor.name}.`;
    payload = new Res.ServerErr({
      details: env.env === 'dev' ? details : undefined
    });
  } else {
    payload = new resType({
      message: err.message,
      details: err.details,
      data: err.data
    });
  }

  res.status(payload.status).json(payload);
};
