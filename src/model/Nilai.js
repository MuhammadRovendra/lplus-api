const mongoose = require('mongoose')
const collectionName = 'nilai'

const schema = new mongoose.Schema(
    {
        IDNILAI: {
            type: String,
        },
        // NAMA_KATEGORI
        IDUSER: {
            type: String
        },
        IDKATEGORI: {
            type: String
        },
        NILAI: {
            type: Number
        },
        LEVEL: {
            type: String
        },
        RATING: {
            type: Number,
            default: 0
        },
        MATERI: [
            {
                IDMATERI: String,
                STATUS: Number,
                LIKE: Boolean,
            }
        ],
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