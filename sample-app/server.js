const path = require('path')
const app = require('./app')
const deadcode = require('../src/index')

// This is where DeadCode protects your app
deadcode.protect(app, path.resolve(__dirname, 'app.js'))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`)
  console.log(`DeadCode is active and watching...\n`)
})