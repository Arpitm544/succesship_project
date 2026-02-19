require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')
const serverless = require('serverless-http')

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

// Root welcome message for backend
app.get('/', (req, res) => {
  res.send('Welcome to the backend!')
})

app.use('/api', apiRoutes)

if (require.main === module) {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Server started on ${port}`)
  })
}

module.exports = serverless(app)
