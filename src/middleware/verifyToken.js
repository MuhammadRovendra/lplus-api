const jwt = require('jsonwebtoken')
const modelUser = require('../model/users')
const { requestResponse } = require('../utils')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    req.IDUSER = decode.IDUSER
    console.log('berhasil')
    next()
  })
}

const verifyUser = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
    console.log(decode)
    req.IDUSER = decode.IDUSER
    const cekUser = await modelUser.findOne({ IDUSER: decode.IDUSER })

    if (!cekUser) {
      return { ...requestResponse.unauthorized }
    }
    if (cekUser.ROLE !== 'Admin') {
      return { ...requestResponse.unauthorized }
    }
    next()
  })
}

module.exports = {
  verifyToken,
  verifyUser
}