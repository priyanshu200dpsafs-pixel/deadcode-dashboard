const express = require('express')
const originalListen = express.application.listen

express.application.listen = function(...args) {
  console.log("Hooked listen!")
  return originalListen.apply(this, args)
}

const app = express()
app.get('/', (req, res) => res.send('ok'))
const server = app.listen(3001, () => {
  console.log("Started")
  server.close()
})
