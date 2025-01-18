const router = require('express').Router()
const users = require('./users')
const category = require('./category')
const materi = require('./materi')
const nilai = require('./nilai')

router.use('/user', users)
router.use('/kategori', category)
router.use('/materi', materi)
router.use('/nilai', nilai)

module.exports = router