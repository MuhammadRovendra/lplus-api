const mongoose = require('mongoose')
const collectionName = 'materi'

const schema = new mongoose.Schema(
    {
        IDMATERI: {
            type: String,
        },
        KATEGORI: {
            type: String
        },
        NAMA_MATERI: {
            type: String
        },
        IMAGES: {
            type: String
        },
        VIDEO: {
            type: String
        },
        // Teori
        MATERI: {
            type: String
        },
        CONTOH: {
            type: String
        },
        SOAL: {
            type: String
        },
        JAWABAN: {
            type: String
        },
        JUMLAH_LIKE: {
            type: Number
        },
        CREATED_AT: {
            type: Date,
            default: () => new Date()
        },
        UPDATED_AT: {
            type: Date,
            default: () => new Date()
        }
    }
)

module.exports = mongoose.model(collectionName, schema)