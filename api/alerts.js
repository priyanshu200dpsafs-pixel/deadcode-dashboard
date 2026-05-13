const express = require('express')
const router = express.Router()
const Alert = require('../models/alert')
const Customer = require('../models/customer')
const jwt = require('jsonwebtoken')

// Customer server sends alert here when trap is hit
router.post('/alert', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) return res.status(401).json({ error: 'No API key' })

    const customer = await Customer.findOne({ apiKey })
    if (!customer) return res.status(401).json({ error: 'Invalid API key' })

    const alert = new Alert({
      customerId: customer._id,
      trap: req.body.trap,
      method: req.body.method,
      path: req.body.path,
      ip: req.body.ip,
      userAgent: req.body.userAgent,
      headers: req.body.headers,
      body: req.body.body
    })

    await alert.save()

    res.json({ received: true, alertId: alert._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all alerts for a customer
router.get('/alerts', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const customer = await Customer.findById(decoded.id)
    if (!customer) return res.status(401).json({ error: 'Invalid token' })

    const alerts = await Alert.find({ customerId: customer._id })
      .sort({ timestamp: -1 })
      .limit(50)

    res.json({ alerts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router