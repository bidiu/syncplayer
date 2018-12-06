const authService = require('../services/auth');
const userService = require('../services/user');
const Res = require('../common/models/responses');
const env = require('../env/env');

/**
 * GET /api/v1/auth/signin
 * 
 * Sign in.
 */
async function signin(req, res) {
  let { username, password } = req.query;
  let user = null;

  if (req.session.user) {
    // already logged in
    user = await userService.retrieve(req.session.user._id);
  } else {
    user = await authService.signin(username, password);
  }

  // update session data
  req.session.user = user;

  // set cookie
  res.cookie('user', JSON.stringify(user), { maxAge: env.maxAge });

  let payload = new Res.Ok({ data: user });
  res.status(payload.status).json(payload);
}

async function signout(req, res) {
  // remove session data
  req.session.user = null;
  // remove cookie
  res.cookie('user', '', { maxAge: 0 });

  let payload = new Res.Ok();
  res.status(payload.status).json(payload);
}

exports.signin = signin;
exports.signout = signout;
