const express = require('express')
const router = express.Router()
const controller = require('../controller/controller_users')
const auth = require('../controller/controller_auth')
const middleware = require('../middleware/verifyToken')

router.post('/login', auth.login)
router.post('/refreshToken', auth.refreshToken)
router.post('/logout', auth.logout)

router.post('/create', controller.create)
router.get('/get', controller.getAll)
router.get('/get/:id', controller.getById)
router.put('/edit/:id', middleware.verifyToken, controller.updateOne)
router.put('/rename/:id', controller.reName)
router.put('/repassword/:id', controller.rePassword)
router.put('/edit/status/:id', middleware.verifyToken, controller.updateStatus)
router.delete('/delete/:id', middleware.verifyToken, controller.deleteOne)
router.get('/count', middleware.verifyToken, controller.getCount)

module.exports = router