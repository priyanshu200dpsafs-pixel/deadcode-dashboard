const app = require('./app')

const PORT = 3003
app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`)
})
