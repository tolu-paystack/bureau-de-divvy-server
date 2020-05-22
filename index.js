const express = require("express")
const bodyParser = require("body-parser")
const logger = require("morgan")
require("dotenv").config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger("dev"))

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
