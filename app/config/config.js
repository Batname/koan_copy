'use strict';

/**
 * Enviroment varables and configuration.
 */

var path = require('path'),
		_ = require('lodash');

/**
 * baseConfig
 * @type {Object}
 */
var baseConfig = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    env: process.env.NODE_ENV,
    secret: process.env.SECRET || 'secret key' /* used in signing the jwt tokens */,
    pass: process.env.PASS || 'pass' /* generic password for seed user logins */
  }
};		

/**
 * environment specific config overrides
 * @type {Object}
 */
var platformConfig = {
  development: {
    app: {
      port: 3020
    },
    mongo: {
      url: 'mongodb://localhost:27017/copy-koan-dev'
    },
    oauth: {
      facebook: {
        clientId: '231235687068678',
        clientSecret: process.env.FACEBOOK_SECRET || '4a90381c6bfa738bb18fb7d6046c14b8',
        callbackUrl: 'http://localhost:3000/signin/facebook/callback'
      },
      google: {
        clientId: '147832090796-ckhu1ehvsc8vv9nso7iefvu5fi7jrsou.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'MGOwKgcLPEfCsLjcJJSPeFYu',
        callbackUrl: 'http://localhost:3000/signin/google/callback'
      }
    }
  },

  test: {
    app: {
      port: 3021
    },
    mongo: {
      url: 'mongodb://localhost:27017/copy-koan-test'
    }
  },

  production: {
    app: {
      port: process.env.PORT || 3020,
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/koan'
    },
    oauth: {
      facebook: {
        clientId: '231235687068678',
        clientSecret: process.env.FACEBOOK_SECRET || '4a90381c6bfa738bb18fb7d6046c14b8',
        callbackUrl: 'https://koan.herokuapp.com/signin/facebook/callback'
      },
      google: {
        clientId: '147832090796-ckhu1ehvsc8vv9nso7iefvu5fi7jrsou.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'MGOwKgcLPEfCsLjcJJSPeFYu',
        callbackUrl: 'https://koan.herokuapp.com/signin/google/callback'
      }
    }
  }
};

/**
 * override the base configuration with the platform specific values
 */
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);
