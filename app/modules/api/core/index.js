/**
* File name: index.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:38:33
*/
import express from 'express'
import Controller from './controller'
const router = express.Router()

router.get('/test', Controller.getTest)
router.post('/test', Controller.postTest)

module.exports = router
