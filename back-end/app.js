const express = require('express')
const app = express()
const axios = require('axios')
const twilio = require('twilio')
require('dotenv').config()

const PORT = process.env.PORT || 8080
const sid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const friendlyService = process.env.TWILIO_VERIFY_SERVICE_SID

const client = twilio(sid, authToken)

app.use(express.json())

// Endpoint to request verification code
app.post('/api/code-request', async (req, res) => {
  const phoneNumber = req.phoneNumber

  const verification = await client.verify.v2
    .services(friendlyService)
    .verifications.create({
      channel: 'sms',
      to: phoneNumber,
    })

  console.log(verification.status)
})

// Endpoint to verify verification code
app.post('/api/code-verify', async (req, res) => {
  const phoneNumber = req.phoneNumber
  const verificationCode = req.verificationCode

  const verificationCheck = await client.verify.v2
    .services(friendlyService)
    .verificationChecks.create({
      code: verificationCode,
      to: phoneNumber,
    })

  console.log(verificationCheck.status)

  if (req.status == 'approves') {
    console.log('POLYCHILOS BLYAT YMNIK EBANIY')
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// const express = require('express')
// require('dotenv').config({ path: './.env' })
// const axios = require('axios')
// const cheerio = require('cheerio')
// const app = express()
// const PORT = process.env.PORT || 8080
// const sid = process.env.SID
// const auth = process.env.AUTH

// app.use(express.static('public')) // Serve static files from public folder

// // API endpoint for handling DOT number lookup
// app.get('/api/url', async (req, res, next) => {
//   try {
//     const dotNumber = req.query.dotNumber
//     console.log(`Received DOT number: ${dotNumber}`) // Log the received DOT number
//     if (!dotNumber) {
//       throw new Error('DOT number is required')
//     }

//     const url = `https://safer.fmcsa.dot.gov/query.asp?searchType=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${dotNumber}`

//     // Perform Axios request to fetch data
//     const response = await axios.get(url)
//     const html = response.data
//     const $ = cheerio.load(html)

//     // Locate the TD element containing the phone number
//     const phoneText = $(
//       'body > p > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > center:nth-child(3) > table > tbody > tr:nth-child(14) > td'
//     )
//       .text()
//       .trim()

//     // Validate phoneText before processing
//     if (!phoneText) {
//       throw new Error('Phone number element not found or empty')
//     }

//     // Extract only digits from the phoneText
//     const phoneDigits = phoneText.match(/\d+/g)

//     // Validate phoneDigits before joining
//     if (!phoneDigits) {
//       throw new Error('Phone number digits not found')
//     }

//     // Join digits into a single string
//     // const phoneDigitsString = '+1' + phoneDigits.join('')
//     const phoneDigitsString = '+1513......

//     const accountSid = sid
//     const authToken = auth
//     const client = require('twilio')(accountSid, authToken)

//     client.verify.v2
//       .services(TWILIO_VERIFY_SERVICE_SID)
//       .verifications.create({ to: phoneDigitsString, channel: 'sms' })
//       .then((verification) => console.log(verification.sid))

//     res.json({ phone: phoneDigitsString })
//   } catch (error) {
//     next(error) // Pass error to error handling middleware
//   }
// })

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ error: err.message })
// })

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
