/**
* File name: util.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:39:15
*/
import _ from 'lodash'
import JWT from 'jsonwebtoken'
import aguid from 'aguid'
import crypto from 'crypto'
import Bcrypt from 'bcrypt'

const SALT_LENGTH = 9
const redis = global.REDIS
const config = global.CONFIG

/**
 * Random string
 * @param {Number} length
 * @return {String}
 */
const randomString = (length = 20) => crypto.randomBytes(length).toString('hex')

/**
 * Generate hash from password
 * @param {String} password
 * @return {Promise}
 */
const generateHash = password => Bcrypt.hash(password, SALT_LENGTH)

/**
 * Compare password with hash string
 * @param {String} plainPassword
 * @param {String} hashPassword
 * @return {Promise}
 */
const compare = (plainPassword, hashPassword) => {
  return Bcrypt
    .compare(plainPassword, hashPassword)
    .then(valid => {
      if (valid) {
        return Promise.resolve(valid)
      }
      return Promise.reject(new Error('Invalid Password'))
    })
}

/**
 * Generate JWT token
 * @param {Object} session
 * @retunr {String}
 */
const createJwtToken = session => {
  const secret = config.get('jwt.secret')
  let jwtToken = JWT.sign({
    id: session.id,
    exp: new Date().getTime() + session.exp
  }, secret)
  return jwtToken
}

/**
 * Generate session information
 * @param {Object} user
 * @param {Boolean} remember
 * @return {Promise}
 */
const createSession = (user, remember) => {
  let cmsName = config.get('name')
  let userSession = {}
  let defaultSession = {
    valid: true,
    id: cmsName + ':Users:' + aguid(), // a random session id,
    uid: '', // user id
    type: 'guest',
    clientIp: user.clientIp,
    scope: [ 'guest' ],
    exp: (remember ? 7 : 1) * config.get('cookieOptions.ttl')
  }

  if (user) {
    /* Set custom session */
    userSession = {
      uid: user._id ? String(user._id) : '',
      type: 'user',
      username: user.username,
      scope: user.roles
    }
  }

  return Promise.resolve(_.merge(defaultSession, userSession))
}

/**
 * Save session information to redis
 * @param {Object} session
 * @return {Object}
 */
const saveSession = (session, ...options) => {
  redis.set(session.id, JSON.stringify(session), ...options)
  return session
}

/**
 * Set expire for invalid key
 * @param {String} redisKey
 */
const invalidSession = redisKey => {
  return redis.getAsync(redisKey)
    .then(result => {
      let session = result ? JSON.parse(result) : {}
      if (!session.id) {
        return Promise.reject(new Error('Invalid session data'))
      }
      session.valid = false
      session.ended = new Date().getTime()
      return saveSession(session, 'EX', 2)
    })
}

/**
 * Compare information, login and generate JWT token
 * @param {String} password
 * @param {Object} user
 * @param {Boolean} remember
 * @return {Promise}
 */
const login = (password, user, remember) => {
  return compare(password, user.password)
    .then(valid => {
      return createSession(user, remember)
    })
    .then(session => {
      return saveSession(session, 'EX', session.exp / 1000)
    })
    .then(session => {
      return createJwtToken(session)
    })
}

/**
 * User logout
 * @param {String} redisKey
 */
const logout = sessionId => invalidSession(sessionId)

/**
 * Route auth valid
 * @param {String} type
 * @return {Promise}
 */
const valid = type => {
  let authFail = (req, res, next) => {
    if (req.baseUrl === '/api') {
      return res.boom.unauthorized()
    }
    return res.redirect('/login')
  }

  return async (req, res, next) => {
    switch (type) {
      case 'guest':
        if (req.auth) {
          return res.redirect('/')
        }
        break
      case 'user':
        if (!req.auth) {
          return authFail(req, res, next)
        }
        break
    }

    return next()
  }
}

export default {
  randomString,
  generateHash,
  compare,
  saveSession,
  invalidSession,
  login,
  logout,
  valid
}
