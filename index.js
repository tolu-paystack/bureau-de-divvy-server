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

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger("dev"))

app.get("/divvy/subaccounts", (req, res) => {
  let secretKey = getKey(req.query.country)

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

app.post("/divvy/subaccount", (req, res) => {
  let { subaccount, country } = req.body
  let secretKey = getKey(country)

  fetch(`https://api.paystack.co/subaccount`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(subaccount),
  })
    .then((response) => response.json())
    .then((result) => res.send(result))
    .catch((error) => res.status(500).end(error))
})

app.post("/divvy/resolve", (req, res) => {
  let { accountNumber, bankCode, country } = req.body
  let secretKey = getKey(country)

  fetch(
    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  )
    .then((response) => response.json())
    .then((resolvedAccount) => res.json(resolvedAccount.data))
    .catch((error) => res.status(500).send(error.message))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

function getKey(country) {
  switch (country) {
    case "ng":
      return process.env.SECRET_KEY_NG
      break
    case "gh":
      return process.env.SECRET_KEY_GH
      break
    case "sa":
      return process.env.SECRET_KEY_SA
      break
    default:
      return null
  }
}
