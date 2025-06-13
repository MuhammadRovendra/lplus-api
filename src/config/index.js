require('dotenv').config()

const mongoURL = process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV

const mongoOptions = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
}

const allowedOrigins = ['http://localhost:5173/']

if (process.env.NODE_ENV === "development") {
    allowedOrigins.push(
        /localhost/
    );
}

const cors = (req, res, next) => {
    const requestHost = req.get('origin') || req.get('host')

    if (allowedOrigins.some((origin) => requestHost.match(origin))) {
        res.header('Access-Control-Allow-Origin', req.get('origin'))
        res.header('Access-Control-Allow-Credentials', 'true')
    }

    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')

    next()
}


module.exports = {
    mongoURL,
    mongoOptions,
    cors
}