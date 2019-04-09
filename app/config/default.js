'use strict'

let config = {}
const Pack = require(global.BASE_PATH + '/package')

config = {
  name: Pack.name,
  session: {
    secret: '6ketaq3cgSDffg878fgo315rk9',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // true on https
      maxAge: 24 * 60 * 60 * 7
    }
  },
  db: {
    uri: 'mongodb://127.0.0.1:27017/db_express_start_kit'
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
  uploadMaxSize: 104857600, // 100MB
  connection: {
    port: 3001
  },
  jwt: {
    secret: 'jKErFl345ghLoPrlafasTHdfgDsdf0werr'
  },
  context: {
    apiPrefix: '/api'
  }
}

module.exports = config
