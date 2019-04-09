/**
* File name: middleware.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 19:04:21
*/
import path from 'path'
import File from '@utils/file'

const moveFile = (req, res, next) => {
  if (req.file) {
    let fileName = req.file.filename + '.' + req.file.mimetype.split('/').pop()
    let destination = path.join(req.file.destination, fileName)
    File.move(req.file.path, destination)
    req.body[req.file.fieldname] = fileName
  }
  next()
}

export default {
  moveFile
}
