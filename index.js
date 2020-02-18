require('dotenv').config()

const {
  NODE_ENV,
  JWT_SECRET,
  MONGO_DB_NAME,
  MONGO_LOCAL_CONN_URL
} = process.env

// set global variables
global.bcrypt = require('bcrypt')
global.mongoose = require('mongoose')
global.environment = NODE_ENV
global.connUri = MONGO_LOCAL_CONN_URL
global.stage = require('./config')[environment]

const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()
const routes = require('./routes/index')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (environment !== 'production') {
  app.use(logger('dev'))
}

app.use('/api/v1', routes(router))

app.listen(`${stage.port}`, () => {
  console.log(`Server is listening at localhost:${stage.port}`)
})


module.exports = app
