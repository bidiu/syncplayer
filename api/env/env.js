/*
 * Use environment variable `THE_HOST_API_ENV` to switch 
 * between different environments.
 */
const dev = require('./dev');
const rc = require('./rc');

const map = new Map([
  ['dev', dev],
  ['development', dev],
  ['rc', rc]
]);

const env = map.get(process.env.THE_HOST_API_ENV || 'dev');

if (typeof env === 'undefined') {
  console.error('Cannot load environment, abort.');
  process.exit(1);
}

module.exports = env;
