require('dotenv').config()
const fs = require('fs')
const Dropbox = require('dropbox').Dropbox;
const fileService = require('../services/file_service')
const service = require('../services/kategori_services')
const logger = require('../utils/logger')
const { v4, validate: isUuid } = require("uuid");
const { requestResponse } = require('../utils/index')
const Promise = require('bluebird')
const formidable = require('formidable')
const form = new formidable.IncomingForm({
    maxFileSize: 50 * 1024 * 1024, // 50MB
})

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
const dateNow = new Date().toISOString().replace(/[:.]/g, '-'); // Untuk format nama file dengan tanggal


let response

const create = async (req, res) => {
    try {
        const { fields, files } = await parseForm(req, form)

        fields.IDKATEGORI = v4()
        let filename
        if (files.IMAGE && files.IMAGE.length > 0) {
            // console.log(files)
            const imageFile = files.IMAGE[0];
            if (imageFile.originalFilename) {
                filename = `${fields.IDKATEGORI}--${dateNow}.${fileService.getFileExtension(imageFile.originalFilename)}`;
                // console.log("Size in bytes:", imageFile.size);
                const oldPath = imageFile.filepath;
                const fileContent = await fs.promises.readFile(oldPath);
                const dropboxPath = `/images/${filename}`;
                try {
                    console.log('tes upload')
                    // Upload file ke Dropbox
                    const uploadResponse = await dbx.filesUpload({
                        path: dropboxPath,
                        contents: fileContent,
                    });

                    console.log("Upload Success:", uploadResponse);

                    // Buat shared link
                    const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                        path: uploadResponse.result.path_lower,
                    });

                    console.log("Shared Link Created:", sharedLinkResponse);

                    // Dapatkan URL mentah untuk frontend
                    const rawUrl = sharedLinkResponse.result.url.replace("?dl=0", "?raw=1");

                    console.log("Direct Image URL:", rawUrl);

                    // Simpan shared link atau rawUrl ke database
                    filename = rawUrl; // Simpan URL mentah untuk digunakan di frontend

                } catch (error) {
                    console.error("Error uploading file or creating shared link:", error);
                    response = { ...requestResponse.unprocessable_entity }
                    return res.json(response);
                }
            }
        }
        const body = fields
        body.IMAGE = filename
        body.KATEGORI = body.KATEGORI[0]
        body.DESKRIPSI = body.DESKRIPSI[0]
        console.log(body)
        const data = await service.create(body)
        // response = { ...data }

        // const shortId = v4()
        // req.body.IDKATEGORI = shortId;
        // const data = await service.create(req.body)
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
        console.log(data)
        response = { ...requestResponse.success, data }
    } catch (error) {
        logger.error(error)
        response = { ...requestResponse.server_error }
    }
    res.json(response)
}

const getById = async (req, res) => {
    try {
        const data = await service.getById({ IDKATEGORI: req.params.id })
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

const updateOneStatus = async (req, res) => {
    try {
        const data = await service.updateOneStatus({ IDKATEGORI: req.params.id }, req.body)
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
    updateOneStatus,
    deleteOne,
    getCount
}