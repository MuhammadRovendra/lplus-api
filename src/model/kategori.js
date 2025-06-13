const mongoose = require('mongoose')
const collectionName = 'category'

const schema = new mongoose.Schema(
    {
        IDKATEGORI: {
            type: String,
        },
        KATEGORI: {
            type: String
        },
        DESKRIPSI: {
            type: String
        },
        IMAGE: {
            type: String
        },
        RATING: {
            type: Number,
            default: 0
        },
        STUDENTS: {
            type: Number,
            default: 0
        },
        STATUS: {
            type: Number,
            // belum publish
            default: 0
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