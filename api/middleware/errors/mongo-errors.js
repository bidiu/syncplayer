const ApiError = require('../../common/models/api-errors');

module.exports = function (err, req, res, next) {
  let result = /index: (\w+)_/.exec(err.message);

  if (err.constructor.name === 'MongoError'
    && err.message
    && err.message.startsWith('E11000 duplicate key error collection')
    && result) {
    
    let key = result[1];
    let message = 'Validation failed';
    let details = { [key]: 'Duplicated value.' };

    next(new ApiError.BadReq({ message, details }));
    return;
  }

  next(err);
};
