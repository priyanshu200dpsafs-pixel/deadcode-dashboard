const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  trap: String,
  method: String,
  path: String,
  ip: String,
  userAgent: String,
  headers: Object,
  body: Object,
  blocked: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Alert', alertSchema)