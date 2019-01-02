const env = Object.freeze({
  env: "rc",
  mongoUri: 'mongodb://mongo_rc:27017/syncplayer',
  // session cookie secret
  secret: 'secret123',
  // session cookie maxage (30 days)
  maxAge: 30 * 86400 * 1000,
  mapApiKey: 'AIzaSyA3amnumsd9ECTmyPgkYRlkfc6F2C9xLwA'
});

module.exports = env;
