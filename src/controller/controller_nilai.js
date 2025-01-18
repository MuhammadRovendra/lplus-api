require('dotenv').config()
const service = require('../services/Nilai_services')
const logger = require('../utils/logger')
const { v4, validate: isUuid } = require("uuid");
const { requestResponse } = require('../utils/index')

let response

const create = async (req, res) => {
    try {
        const shortId = v4()
        req.body.IDKATEGORI = shortId;
        const data = await service.create(req.body)
        response = { ...data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getAll = async (req, res) => {
    try {
        const data = await service.getAll()
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const updateNilai = async (req, res) => {
    try {
        const dataBody = req.body
        const data = await service.updateNilai({ IDUSER: req.params.id }, dataBody)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const likeOrNoLike = async (req, res) => {
    try {
        const dataBody = req.body
        const data = await service.likeOrNoLike({ IDUSER: req.params.id }, dataBody)
        response = { ...data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getByIdUser = async (req, res) => {
    try {
        const data = await service.getAll({ IDUSER: req.params.id })
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const updateOne = async (req, res) => {
    try {
        const data = await service.updateOne({ IDKATEGORI: req.params.id }, req.body)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const deleteOne = async (req, res) => {
    try {
        const data = await service.deleteOne({ IDKATEGORI: req.params.id })
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getCount = async (req, res) => {
    try {
        const data = await service.getCount()
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

module.exports = {
    create,
    getAll,
    updateNilai,
    likeOrNoLike,
    getByIdUser,
    updateOne,
    deleteOne,
    getCount
}