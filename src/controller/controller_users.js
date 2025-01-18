require('dotenv').config()
const fileService = require('../services/file_service')
const service = require('../services/users_services')
const logger = require('../utils/logger')
const { requestResponse } = require('../utils/index')
const { v4, validate: isUuid } = require("uuid");
const Promise = require('bluebird')
const formidable = require('formidable')
const form = new formidable.IncomingForm({
    maxFileSize: 50 * 1024 * 1024, // 50MB
})


let response

const create = async (req, res) => {
    try {
        const shortId = v4()
        req.body.IDUSER = shortId;
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
        const attributes = {
            IDUSER: 1,
            NAME: 1,
            EMAIL: 1,
            USERNAME: 1,
            NO_TELP: 1,
            ALAMAT: 1,
            ROLE: 1,
            STATUS: 1,
            CREATED_AT: 1,
        }
        const data = await service.getAll(attributes)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getById = async (req, res) => {
    try {
        const data = await service.getById({ IDUSER: req.params.id })
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const updateOne = async (req, res) => {
    try {
        const data = await service.updateOne({ IDUSER: req.params.id }, req.body)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const reName = async (req, res) => {
    try {
        const data = await service.reName({ IDUSER: req.params.id }, req.body)
        response = { ...data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const rePassword = async (req, res) => {
    try {
        const data = await service.rePassword({ IDUSER: req.params.id }, req.body)
        response = { ...data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const updateStatus = async (req, res) => {
    try {
        const data = await service.updateStatus({ IDUSER: req.params.id }, req.body)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const deleteOne = async (req, res) => {
    try {
        const data = await service.deleteOne({ IDUSER: req.params.id })
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

const parseForm = (req, form) => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fields, files });
            }
        });
    });
};

module.exports = {
    create,
    getAll,
    getById,
    updateOne,
    reName,
    rePassword,
    updateStatus,
    deleteOne,
    getCount
}