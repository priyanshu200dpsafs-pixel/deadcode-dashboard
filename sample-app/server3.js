const express = require('express')
const app = express()

app.get('/api/v1/orders', (req, res) => res.send('ok'))

const PORT = 3004
app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`)
})
