const express = require("express")
const bodyParser = require("body-parser")
const logger = require("morgan")
const fetch = require("node-fetch")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT

// const corsOptions = {
//   origin: "http://localhost:8080",
//   optionsSuccessStatus: 200,
// }

// app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger("dev"))

app.get("/divvy/subaccounts", (req, res) => {
  const country = req.query.country
  let secretKey = ""

  switch (country) {
    case "Nigeria":
      secretKey = process.env.SECRET_KEY_NG
      break
    case "Ghana":
      secretKey = process.env.SECRET_KEY_GH
      break
    case "sa":
      secretKey = process.env.SECRET_KEY_SA
      break
    default:
      return null
  }

  fetch(`https://api.paystack.co/subaccount`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })
    .then((response) => response.json())
    .then((subaccounts) => {
      res.send(subaccounts.data)
    })
    .catch((error) => res.status(500).end(error))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
