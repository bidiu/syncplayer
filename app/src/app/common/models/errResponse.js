class ErrResponse {
  constructor({ status, message, details } = {}) {
    this.status = status;
    this.message = message;
    this.details = details;
  }
}

export default ErrResponse;
