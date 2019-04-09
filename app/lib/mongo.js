/**
* File name: mongo.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:37:41
*/
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

module.exports = async () => {
  await mongoose.connect(global.CONFIG.get('db.uri'), { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true)
  mongoose.plugin(mongoosePaginate)
  console.log('Register Mongo:', global.CONFIG.get('db.uri'))
}
