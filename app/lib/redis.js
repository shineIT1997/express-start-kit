/**
* File name: redis.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:37:50
*/
import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

module.exports = () => {
  return new Promise(resolve => {
    let settings = global.CONFIG.get('redisOptions')
    let client = redis.createClient(settings)

    client.on('error', err => {
      console.log('REDIS Error: ', err)
    })

    client.on('ready', () => {
      console.log('REDIS READY')
      resolve()
    })

    client.on('connect', () => {
      console.log('REDIS Connected')
    })

    global.REDIS = client
  })
}
