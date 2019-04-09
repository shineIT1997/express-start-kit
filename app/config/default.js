'use strict'

let config = {}
const Pack = require(global.BASE_PATH + '/package')

config = {
  name: Pack.name,
  sessionKey: '6ketaq3cgSDffg878fgo315rk9',
  db: {
    uri: 'mongodb://127.0.0.1:27017/db_tk_test'
  },
  cookieOptions: {
    ttl: 24 * 60 * 60 * 1000, // expires a day from today
    encoding: 'none', // we already used JWT to encode
    isSecure: false, // warm & fuzzy feelings
    isHttpOnly: true, // prevent client alteration
    clearInvalid: false, // remove invalid cookies
    strictHeader: true, // don't allow violations of RFC 6265
    path: '/' // set the cookie for all routes
  },
  security: {
    ratelimiterSeconds: 10,
    ratelimiterMaxRequest: 10
  },
  date: {
    format: 'MMM DD, YYYY'
  },
  paging: {
    defaultPageSize: 25,
    numberVisiblePages: 10,
    itemsPerPage: 20
  },
  redisOptions: {
    host: '127.0.0.1',
    port: 6379,
    detect_buffers: true
  },
  mailer: {
    options: {
      // pool: true,
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: 'example@email.com',
        pass: '123456'
      },
      logger: false, // log to console
      debug: false // include SMTP traffic in the logs
    },
    defaults: {
      from: 'Develop <sender@example.com>'
    }
  },
  upload: {
    commander: process.cwd() + '/app/commander',
    path: process.cwd() + '/public/files',
    bookCover: process.cwd() + '/public/files/bookCover'
  },
  uploadMaxBytes: 104857600, // 100MB
  connection: {
    port: process.env.CMS_ADMIN_PORT || 3001,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    // auth: {
    //   scope: ['admin']
    // }
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET_CMS || 'jKErFl345ghLoPrlafasTHdfgDsdf0werr'
  },
  context: {
    apiPrefix: '/api'
  }
}

module.exports = config
