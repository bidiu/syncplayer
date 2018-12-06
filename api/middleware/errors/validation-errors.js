const { Error } = require('mongoose');
const ApiError = require('../../common/models/api-errors');

module.exports = function (err, req, res, next) {
  if (!(err instanceof Error.ValidationError)) {
    next(err);
    return;
  }

  let message = err._message;
  let details = {};
  Object.entries(err.errors)
    .forEach(([key, { message }]) => details[key] = message);

  next(new ApiError.BadReq({ message, details }));
};
