const express = require('express')
const router = express.Router()
const controller = require('../controller/controller_materi')
const { verifyToken, verifyUser } = require('../middleware/verifyToken')
const { upload } = require('../utils')
const { v4 } = require('uuid')

router.post('/create', controller.create)
router.get('/get', controller.getAll)
router.get('/get-category/:id', controller.getAllByCategory)
router.get('/get-status', controller.getByStatus)
router.get('/get/:id', controller.getById)
router.put('/edit/:id', controller.updateOne)
router.put('/edit-status/:id', controller.updateStatus)
router.delete('/delete/:id', controller.deleteOne)
router.get('/count', controller.getCount)

module.exports = router