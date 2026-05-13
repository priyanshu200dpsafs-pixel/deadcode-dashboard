const express = require('express')
const app = express()
app.use(express.json())

app.get('/api/v1/users/:id/profile', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice', email: 'alice@example.com' })
})

app.post('/api/v1/auth/login', (req, res) => {
  res.json({ token: 'eyJhbGciOiJIUzI1NiJ9.real', expiresIn: 3600 })
})

app.get('/api/v1/orders', (req, res) => {
  res.json({ orders: [{ id: 'ord_001', total: 49.99 }] })
})

module.exports = app