/**
* File name: index.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:37:37
*/
import Path from 'path'
import Glob from 'glob'
import express from 'express'
import nunjucks from 'nunjucks'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'connect-flash'
import boom from 'express-boom'
import File from '@utils/file'

const config = global.CONFIG

let dirs = config.get('upload')
for (let key of Object.keys(dirs)) {
  File.ensureDirExists(dirs[key])
}

module.exports = async app => {
  // step by step - careful

  // mongoDB
  await require('../lib/mongo')()

  // autoload models
  let models = Glob.sync(global.BASE_PATH + '/app/models/*/model*.js', {})
  for (let model of models) {
    require(Path.resolve(model))
  }

  // redis
  await require('../lib/redis')()

  // boom response
  app.use(boom())

  // static files
  app.use('/files', express.static('public/files'))
  app.use('/api/files', express.static('public/files'))

  // setup view-engine and filters
  app.set('view engine', 'html')
  require(Path.join(global.BASE_UTIL, 'filters'))(nunjucks.configure(global.BASE_VIEW, {
    express: app,
    autoescape: true,
    watch: true,
    tags: {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '{{',
      variableEnd: '}}',
      commentStart: '{#',
      commentEnd: '#}'
    }
  }))

  // support parsing of application/json type post data
  app.use(bodyParser.json())
  // support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }))

  // support cookie
  app.use(cookieParser(config.get('sessionKey')))

  // session and flash
  app.set('trust proxy', 1) // trust first proxy
  app.use(session({
    secret: config.get('sessionKey'),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // true on https
      maxAge: 24 * 60 * 60 * 7
    }
  }))
  app.use(flash())

  // setup passportjs
  // const passport = require('../lib/passport')
  // app.use(passport.initialize())
  // app.use(passport.session())

  // load middlewares
  let middlewares = Glob.sync(global.BASE_PATH + `/app/middlewares/*.js`, {})
  for (let middleware of middlewares) {
    app.use(require(Path.resolve(middleware)))
  }

  // autoload web modules
  let modules = Glob.sync(global.BASE_PATH + `/app/modules/web/*/index.js`, {})
  for (let mod of modules) {
    app.use('/', require(Path.resolve(mod)))
  }

  // autoload api modules
  modules = Glob.sync(global.BASE_PATH + `/app/modules/api/*/index.js`, {})
  for (let mod of modules) {
    app.use(config.get('context.apiPrefix'), require(Path.resolve(mod)))
  }

  // setup error
  require('../modules/error')(app)
}
