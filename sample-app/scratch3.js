const express = require('express')
const app = express()

app.use((req, res, next) => { console.log('1'); next() })
app.get('/', (req, res) => res.send('ok'))

const qMw = (req, res, next) => { console.log('Quarantine Block!'); next() }

app.use(qMw);
const layer = app._router.stack.pop();
app._router.stack.unshift(layer);

const server = app.listen(3002, async () => {
  const res = await fetch('http://localhost:3002/')
  console.log(await res.text())
  server.close()
})
