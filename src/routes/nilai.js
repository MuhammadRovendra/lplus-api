const express = require('express')
const router = express.Router()
const controller = require('../controller/controller_nilai')


router.post('/create', controller.create)
router.get('/get', controller.getAll)
router.get('/get/:id', controller.getByIdUser)
router.put('/edit/:id', controller.updateOne)
router.put('/update-nilai/:id', controller.updateNilai)
router.put('/update-like/:id', controller.likeOrNoLike)
router.delete('/delete/:id', controller.deleteOne)
router.get('/count', controller.getCount)

module.exports = router