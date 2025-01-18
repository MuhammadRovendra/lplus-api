const mongoose = require('mongoose')
const collectionName = 'category'

const schema = new mongoose.Schema(
    {
        IDKATEGORI: {
            type: String,
        },
        // NAMA_KATEGORI
        KATEGORI: {
            type: String
        },
        DESKRIPSI: {
            type: String
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