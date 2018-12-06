const mongoose = require('mongoose');
const { mongoUri } = require('../env/env');

console.log('MongoDB\'s URI is ' + mongoUri);

mongoose.connect(mongoUri)
  .then(() => {
    require('../scripts/populate');
  })
  .catch(err => {
    // cannot connect to mongodb
    console.error(err);

    // just end the process immediately
    process.exit(1);
  });
