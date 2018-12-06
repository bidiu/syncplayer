const User = require('../models/user');
const ApiError = require('../common/models/api-errors');

const fields = `email username name age sex avatarUrl`;

async function retrieve(userId, projection = fields) {
  let user = await User.findById(userId, projection);
  
  if (user) { return user; }
  throw new ApiError.NotFound();
}

/**
 * TODO support email also
 */
async function retrieveByUsername(username, projection = fields) {
  let user = await User.findOne({ username }, projection);

  if (user) { return user; }
  throw new ApiError.NotFound();
}

async function create(doc) {
  let user = await User.create(doc);
  return retrieve(user._id);
}

async function update(doc) {
  let user = await retrieve(doc._id);

  await user.update(doc);
  return retrieve(doc._id);
}

exports.retrieve = retrieve;
exports.retrieveByUsername = retrieveByUsername;
exports.create = create;
exports.update = update;
