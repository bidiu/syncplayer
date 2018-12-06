const env = Object.freeze({
  env: "dev",
  mongoUri: 'mongodb://the_host_mongo_dev:27017/thehost',
  // session cookie secret
  secret: 'secret123',
  // session cookie maxage (30 days)
  maxAge: 30 * 86400 * 1000,
  mapApiKey: 'AIzaSyA3amnumsd9ECTmyPgkYRlkfc6F2C9xLwA'
});

module.exports = env;
