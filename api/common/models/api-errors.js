/* a generic error type */
function ApiError(message, details, data) {
  Error.call(this);
  this.message = message;
  this.details = details;
  this.data = data;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

/* more specific errors */
const ERROR_TYPES = [
  (() => {
    function BadReq({ message = 'Request is bad.', details, data } = {}) {
      ApiError.call(this, message, details, data);
    }
    BadReq.status = 400;
    return BadReq;
  })(),
  (() => {
    function NotFound({ message = 'Resources are not found.', details, data } = {}) {
      ApiError.call(this, message, details, data);
    }
    NotFound.status = 404;
    return NotFound;
  })(),
  (() => {
    // either no authentication or bad authentication
    function BadAuthentication({ message = 'You are not authenticated.', details, data } = {}) {
      ApiError.call(this, message, details, data);
    }
    BadAuthentication.status = 401;
    return BadAuthentication;
  })(),
  (() => {
    function NoAuthorization({ message = 'You don\'t have the authorization.', details, data } = {}) {
      ApiError.call(this, message, details, data);
    }
    NoAuthorization.status = 403;
    return NoAuthorization;
  })(),
  (() => {
    function InternalErr({ message = 'Internal server error occurred.', details, data } = {}) {
      ApiError.call(this, message, details, data);
    }
    InternalErr.status = 500;
    return InternalErr;
  })()
];

ERROR_TYPES.forEach((errorType) => {
  errorType.prototype = Object.create(ApiError.prototype);
  errorType.prototype.constructor = errorType;
  ApiError[errorType.name] = errorType;
  ApiError[errorType.status] = errorType;
});

module.exports = ApiError;
