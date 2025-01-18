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
        NILAI: {
            type: Number
        },
        PROGRES: [
            {
                LEVEL: String,
                MATERI: [
                    {
                        IDMATERI: String,
                        STATUS: Number,
                        LIKE: Boolean,
                    }
                ]
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