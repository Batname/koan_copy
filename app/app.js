'use strict';

/**
 * Entry point for koan copy app
 */

var co = require('co'),
		koa = require('koa'),
		app = koa();

/**
 * Connect configs
 */

var config = require('./config/config'),
		mongoCommon = require('./models/common'),
		mongoSeed = require('./models/seed/mongo-seed'),
		koaConfig = require('./config/koa');

module.exports = app;		

/**
 * Initiates a new KOAN server. Returns a promise.
 * @param overwriteDB Overwrite existing database with the seed data. Useful for testing environment.
 */
app.init = co.wrap(function *(overwriteDB) {
  // initialize mongodb and populate the database with seed data if empty
  yield mongoCommon.connect();
  yield mongoSeed(overwriteDB);

  // koa config
  koaConfig(app);

  // create http servers and start listening for requests
  app.server = app.listen(config.app.port);
  if (config.app.env !== 'test') {
    console.log('KOAN listening on port ' + config.app.port);
  }
});

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  app.init().catch(function (err) {
    console.error(err.stack);
    process.exit(1);
  });
}