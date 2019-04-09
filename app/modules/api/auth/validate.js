/**
* File name: validate.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:39:03
*/
import Joi from 'joi'

export default {
  login: {
    body: {
      user: Joi.string().required().description('user'),
      password: Joi.string().min(5).required().description('password'),
      remember: Joi.boolean().description('remember')
    }
  }
}
