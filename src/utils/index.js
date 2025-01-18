require('dotenv').config()
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/upload/'); // Pastikan folder ini ada
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

// REQUEST RESPONSE
const requestResponse = {
    success: {
        code: 200,
        status: true,
        message: 'BERHASIL MEMUAT PERMINTAAN'
    },
    incomplete_body: {
        code: 400,
        status: false,
        message: 'PERMINTAAN DALAM MASALAH, CEK PERMINTAAN ANDA'
    },
    unauthorized: {
        code: 401,
        status: false,
        message: 'UNAUTHORIZED'
    },
    not_found: {
        code: 404,
        status: false,
        message: 'FILE TIDAK DITEMUKAN'
    },
    unprocessable_entity: {
        code: 422,
        status: false,
        message: 'PERMINTAAN TIDAK DAPAT DI PROSES'
    },
    server_error: {
        code: 500,
        status: false,
        message: 'SERVER DALAM GANGGUAN, SILAHKAN KONTAK ADMINISTRATOR'
    },
}

module.exports = {
    requestResponse,
    upload
}