/**
* File name: auth.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:37:54
*/
import JWT from 'jsonwebtoken'
const redis = global.REDIS
const config = global.CONFIG

module.exports = async (req, res, next) => {
  let jwtToken = req.cookies.token

  if (jwtToken) {
    try {
      let secret = config.get('jwt.secret')
      let decoded = JWT.verify(jwtToken, secret)
      let auth = await redis.getAsync(decoded.id)
      try {
        auth = JSON.parse(auth)
        req.auth = auth
        res.locals.auth = auth
      } catch (error) {}
    } catch (error) {
      console.log('JWT: ', error)
    }
  }

  return next()
}
