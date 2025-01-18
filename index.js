require('dotenv').config()

const http = require('http')
const logger = require('./src/utils/logger')
const app = require('./src/app')
const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  logger.info(`SERVER RUNNING IN PORT ${process.env.PORT}`);
});
