const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Customer = require('../models/customer')

// Company signs up
router.post('/register', async (req, res) => {
  try {
    const { companyName, email, password } = req.body
    if (!companyName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const apiKey = crypto.randomBytes(32).toString('hex')

    const customer = new Customer({
      companyName,
      email,
      password: hashed,
      apiKey
    })

    await customer.save()

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Account created!',
      token,
      apiKey,
      companyName
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Company logs in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const customer = await Customer.findOne({ email })
    if (!customer) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, customer.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, apiKey: customer.apiKey, companyName: customer.companyName })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router