const userService = require('./user');
const ApiError = require('../common/models/api-errors');

async function signin(username, password) {
  let user = await userService.retrieveByUsername(username, 'password');
  
  if (password === user.password) {
    return userService.retrieve(user._id);
  }
  throw new ApiError.BadReq({ details: 'Invalid credentials.' });
}

exports.signin = signin;
