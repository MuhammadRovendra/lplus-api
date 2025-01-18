const mongoose = require('mongoose')
const collectionName = 'user'

const schema = new mongoose.Schema(
    {
        IDUSER: {
            type: String
        },
        NAME: {
            type: String,
        },
        EMAIL: {
            type: String
        },
        PASSWORD: {
            type: String
        },
        REFRESH_TOKEN: {
            type: String,
            default: '-'
        },
        ROLE: {
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