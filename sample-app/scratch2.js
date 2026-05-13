const express = require('express')
const app = express()

app.use((req, res, next) => { console.log('1'); next() })
app.get('/', (req, res) => res.send('ok'))

// Inject middleware at the front
const qMw = (req, res, next) => { console.log('Quarantine Block!'); next() }

// Express adds 'query' and 'expressInit' as the first two middleware automatically when the first use/get is called.
// So we should insert at index 2, or just unshift to index 0. Let's see what happens if we unshift.
app._router.stack.unshift({
  handle: qMw,
  name: 'quarantine',
  params: undefined,
  path: undefined,
  keys: [],
  regexp: /^\/?(?=\/|$)/i,
  match: function match(path) { return true; }
}); // wait, it's easier to just do app.use() then move the last element to the front

app.use(qMw);
const layer = app._router.stack.pop();
// Let's put it at index 0
app._router.stack.unshift(layer);

const server = app.listen(3002, async () => {
  const res = await fetch('http://localhost:3002/')
  console.log(await res.text())
  server.close()
})
