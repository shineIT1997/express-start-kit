'use strict'

/* Nơi dev customer trên local mỗi đev */
/* Tạo file production.js cùng cấp và copy nội dung file này bỏ vào và customs nếu cần */

let config = {}

config = {
  db: {
    uri: 'mongodb://127.0.0.1/db_production',
    options: {
      user: '',
      pass: ''
    }
  }
}

module.exports = config
