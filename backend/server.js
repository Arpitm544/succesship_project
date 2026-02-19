require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')


const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

// Root welcome message for backend
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Backend API</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; }
          h1 { color: #333; }
          ul { list-style-type: disc; padding-left: 20px; }
          li { margin: 10px 0; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Welcome to the Backend!</h1>
        <p>Available Endpoints:</p>
        <ul>
          <li><code>GET /api/memories</code> - Retrieve all memories</li>
          <li><code>POST /api/memories</code> - Create a new memory</li>
          <li><code>POST /api/query</code> - Query memories with AI</li>
        </ul>
      </body>
    </html>
  `
  res.send(html)
})

app.use('/api', apiRoutes)

if (require.main === module) {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Server started on ${port}`)
  })
}

// Export the app for Vercel
module.exports = app
