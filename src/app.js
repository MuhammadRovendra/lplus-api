require('dotenv').config()
const express = require('express')
const router = require('./routes')
const mongo = require('./database/mongo')
const logger = require('./utils/logger')
const cookies = require('cookie-parser')
const path = require('path')
const cors = require('cors')
// const { cors } = require('./config/index')

const connectionDatabase = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongo.createConnection();
            logger.info(`SUCCESS CONNECTING TO DATABASE MONGODB`);
            return;
        } catch (err) {
            logger.error(`Error connecting to database. Retry ${i + 1}/${retries}`, err);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                logger.error(`Could not connect to database after ${retries} retries`);
                process.exit(1); // Exit process after all retries fail
            }
        }
    }
};

connectionDatabase()

const app = express()

app.use(cors())
app.use(cookies())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'upload')))
app.use(express.static('statics'))

app.use(router)

app.get('/', (req, res) => {
    res.json({
        msg: 'selamat datang di API Web Learning',
    });
});

module.exports = app


