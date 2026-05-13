const express = require('express')
const app = express()
app.get('/api/v1/orders', (req, res) => res.send('ok'))
app.use((req, res, next) => next()) // a middleware

const layer = app._router.stack.pop()
app._router.stack.unshift(layer)

console.log(app._router.stack.map(l => l.name))
