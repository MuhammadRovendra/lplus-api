require('dotenv').config()
const service = require('../services/Nilai_services')
const logger = require('../utils/logger')
const { v4, validate: isUuid } = require("uuid");
const { requestResponse } = require('../utils/index')

let response

const create = async (req, res) => {
    try {
        // console.log(req.body)
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

const updateRating = async (req, res) => {
    const { idUser } = req.params;
    console.log(req.body)

    try {
        console.log('masuk datanya su')
        const result = await service.updateUserRatingAndBundleAverage(idUser, req.body);

        return res.status(requestResponse.success.code).json({
            ...requestResponse.success,
            message: 'Rating berhasil diperbarui.',
            data: result
        });

    } catch (error) {
        if (error.message === "INVALID_RATING") {
            return res.status(requestResponse.incomplete_body.code).json({
                ...requestResponse.incomplete_body,
                message: "Rating harus antara 0 - 5"
            });
        } else if (error.message === "NILAI_NOT_FOUND") {
            return res.status(requestResponse.not_found.code).json({
                ...requestResponse.not_found,
                message: "Data nilai tidak ditemukan."
            });
        } else if (error.message === "BUNDLE_NOT_FOUND") {
            return res.status(requestResponse.not_found.code).json({
                ...requestResponse.not_found,
                message: "Bundle tidak ditemukan."
            });
        }

        console.error("Error updateRating:", error);
        return res.status(requestResponse.server_error.code).json({
            ...requestResponse.server_error
        });
    }
};


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
        const data = await service.getAllByUser({ IDUSER: req.params.idUser })
        console.log(data)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getByIdUserAndKategori = async (req, res) => {
    try {
        console.log(req.params.idUser, req.params.idBundle)
        const data = await service.getAllByUserAndKategori({ IDUSER: req.params.idUser, IDKATEGORI: req.params.idBundle })
        // console.log(data)
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
    updateRating,
    likeOrNoLike,
    getByIdUser,
    getByIdUserAndKategori,
    updateOne,
    deleteOne,
    getCount
}