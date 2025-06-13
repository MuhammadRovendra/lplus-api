const express = require('express')
const router = express.Router()
const controller = require('../controller/controller_nilai')


router.post('/create', controller.create)
router.get('/get', controller.getAll)
router.get('/get/:idUser/:idBundle', controller.getByIdUserAndKategori)
router.get('/get/:idUser', controller.getByIdUser)
router.put('/edit/:id', controller.updateOne)
router.put('/edit-rating/:idUser', controller.updateRating)
router.put('/update-nilai/:id', controller.updateNilai)
router.put('/update-like/:id', controller.likeOrNoLike)
router.delete('/delete/:id', controller.deleteOne)
router.get('/count', controller.getCount)

module.exports = router