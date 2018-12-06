/**
 * Two jobs:
 *      1. Clear all query parameters, if method is not GET
 *      2. Clear other query parameters except for 'params',
 *         if methodis GET. And if 'params' is not a valid JSON,
 *         return 400 response.
 *      3. Clear body if method is GET.
 */
module.exports = function (req, res, next) {
  try {
    if (req.method === 'GET') {
      let query = {};
      if (req.query.params) {
        query = JSON.parse(req.query.params);
      }
      req.query = query;
      req.body = {};
    } else {
      req.query = {};
    }
    next();
  } catch (e) {
    // JSON syntax is not correct
    // TODO
    res.status(400).json({ message: 'Invalid params.' });
  }
}
