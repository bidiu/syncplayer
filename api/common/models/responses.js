function Res(status, message, details, data) {
  this.status = status;
  this.message = message;
  this.details = details;
  this.data = data;
}

const RES_TYPES = [
  (() => {
    function Ok({ message = 'OK', details, data } = {}) {
      Res.call(this, 200, message, details, data);
    }
    return Ok;
  })(),
  (() => {
    function NoContent({ message = 'No Content', details, data } = {}) {
      Res.call(this, 204, message, details, data);
    }
    return NoContent;
  })(),
  (() => {
    function BadReq({ message = 'Bad Request', details, data } = {}) {
      Res.call(this, 400, message, details, data);
    }
    return BadReq;
  })(),
  (() => {
    function UnAuth({ message = 'Unauthorized', details, data } = {}) {
      Res.call(this, 401, message, details, data);
    }
    return UnAuth;
  })(),
  (() => {
    function Forbidden({ message = 'Forbidden', details, data } = {}) {
      Res.call(this, 403, message, details, data);
    }
    return Forbidden;
  })(),
  (() => {
    function NotFound({ message = 'Not Found', details, data } = {}) {
      Res.call(this, 404, message, details, data);
    }
    return NotFound;
  })(),
  (() => {
    function ServerErr({ message = 'Internal Server Error', details, data } = {}) {
      Res.call(this, 500, message, details, data);
    }
    return ServerErr;
  })(),
  (() => {
    function NotImplemented({ message = 'Not Implemented', details, data } = {}) {
      Res.call(this, 501, message, details, data);
    }
    return NotImplemented;
  })()
];

RES_TYPES.forEach((resType) => {
  resType.prototype = Object.create(Res.prototype);
  resType.prototype.constructor = resType;
  Res[resType.name] = resType;
});

module.exports = Res;
