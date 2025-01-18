const model = require('../model/users')
const modelKategori = require('../model/kategori')
const modelMateri = require('../model/materi')
const modelNilai = require('../model/Nilai')
const bcrypt = require('bcrypt')
const { requestResponse } = require('../utils/index')
const { v4, validate: isUuid } = require("uuid");

let response

const create = async (data) => {
    // console.log(data)
    const saltRounds = 12
    const checkData = await model.findOne({ EMAIL: data.EMAIL }, { _id: false }, { lean: true })
    console.log(checkData)
    if (checkData !== null) {
        response = { ...requestResponse.unprocessable_entity }
        response.message = 'EMAIL TELAH TERDAFTAR'
        return response
    }

    console.log(data)

    if (data.PASSWORD !== data.CONFPASSWORD) {
        response = { ...requestResponse.unprocessable_entity }
        response.message = 'TOLONG KONFIRMASI PASSWORD ANDA'
        return response
    }
    const pass = data.PASSWORD
    const hashPassword = await bcrypt.hash(pass, saltRounds)
    data.PASSWORD = hashPassword

    const dataMateri = await modelMateri.find()
    const dataKategori = await modelKategori.find()

    // console.log(dataKategori)
    // console.log(dataMateri)

    const progress = dataKategori.map((kategori) => {
        const materiDalamKategori = dataMateri
            .filter((materi) => materi.KATEGORI === kategori.IDKATEGORI)
            .map((materi) => ({
                IDMATERI: materi.IDMATERI,
                STATUS: 0,
                LIKE: false
            }))

        console.log(materiDalamKategori)
        return {
            LEVEL: kategori.KATEGORI,
            MATERI: materiDalamKategori
        }
    })

    const dataProgressBelajar = {
        IDNILAI: v4(),
        IDUSER: data.IDUSER,
        NILAI: 0,
        PROGRES: progress
    }

    console.log(dataProgressBelajar)
    await model.create(data)
    await modelNilai.create(dataProgressBelajar)
    return { ...requestResponse.success }
}

const getAll = async (attributes) => {
    return await model.find({}, attributes, { _id: false }, { lean: false },)
}

const getById = async (condition) => {
    return model.findOne(condition)
}

const updateOne = async (condition, body) => {
    return model.updateOne(condition, body)
}

const reName = async (condition, body) => {
    const data = await model.findOne({ IDUSER: condition.IDUSER }, { _id: false }, { lean: true })
    if (data.NAME === body.NAME) {
        response = { ...requestResponse.unauthorized }
        response.message = 'NAMA YANG ANDA MASUKAN ADALAH NAMA LAMA'
        return response
    }
    const comparePassword = await bcrypt.compare(body.PASSWORD, data.PASSWORD);
    // console.log(comparePassword)
    if (!comparePassword) {
        response = { ...requestResponse.unauthorized }
        response.message = 'PASSWORD ANDA SALAH'
        return response
    }

    await model.updateOne({ IDUSER: condition.IDUSER }, {
        $set: {
            NAME: body.NAME
        }
    })

    return response = { ...requestResponse.success }
}

const rePassword = async (condition, body) => {
    console.log(body)
    const saltRounds = 12
    const data = await model.findOne({ IDUSER: condition.IDUSER }, { _id: false }, { lean: true })
    const comparePassword = await bcrypt.compare(body.OLD_PASSWORD, data.PASSWORD);
    // console.log(comparePassword)
    if (!comparePassword) {
        response = { ...requestResponse.unauthorized }
        response.message = 'PASSWORD ANDA SALAH'
        return response
    }

    if (body.NEW_PASSWORD !== body.CONF_PASSWORD) {
        response = { ...requestResponse.unauthorized }
        response.message = 'KONFIRMASI KEMBALI PASSWORD ANDA'
        return response
    }

    const compareNewPassword = await bcrypt.compare(body.NEW_PASSWORD, data.PASSWORD);
    if (compareNewPassword) {
        response = { ...requestResponse.unauthorized }
        response.message = 'PASSWORD YANG ANDA MASUKAN PASSWORD LAMA ANDA SILAHKAN MASUKAN PASSWORD YANG BARU'
        return response
    }

    const pass = body.NEW_PASSWORD
    const hashPassword = await bcrypt.hash(pass, saltRounds)

    await model.updateOne({ IDUSER: condition.IDUSER }, {
        $set: {
            PASSWORD: hashPassword
        }
    })

    return response = { ...requestResponse.success }
}

const updateStatus = async (condition, body) => {
    const cekUser = await model.findOne(condition)

    if (cekUser.STATUS === 'Menunggu Konfirmasi') {
        if (body.PASSWORD !== '') {
            const saltRounds = 12
            const hashPassword = await bcrypt.hash(body.PASSWORD, saltRounds)
            return await model.updateOne(condition, {
                $set: {
                    STATUS: 'Aktif',
                    PASSWORD: hashPassword

                }
            })
        }
        return await model.updateOne(condition, {
            $set: {
                STATUS: 'Aktif',
            }
        })
    } else if (cekUser.STATUS === 'Aktif') {
        return await model.updateOne(condition, {
            $set: {
                STATUS: 'Nonaktif',
            }
        })
    } else {
        return await model.updateOne(condition, {
            $set: {
                STATUS: 'Aktif',
            }
        })
    }
}

const deleteOne = (condition) => {
    return model.deleteOne(condition)
}

const getCount = (condition) => {
    return model.countDocuments(condition)
}

module.exports = {
    create,
    getAll,
    updateOne,
    updateStatus,
    reName,
    rePassword,
    getById,
    deleteOne,
    getCount
}