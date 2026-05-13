const request = require('supertest')
const path = require('path')

let app, deadcode

beforeEach(() => {
  jest.resetModules()
  deadcode = require('../src/index')
  deadcode.clearAlertLog()

  app = require('express')()
  app.use(require('express').json())

  app.get('/api/v1/users/:id/profile', (req, res) =>
    res.json({ id: req.params.id, name: 'Alice' }))
  app.post('/api/v1/auth/login', (req, res) =>
    res.json({ token: 'real-token' }))
  app.get('/api/v1/orders', (req, res) =>
    res.json({ orders: [] }))

  deadcode.protect(app, path.resolve(__dirname, '../sample-app/app.js'))
})

test('real route works after injection', async () => {
  const res = await request(app).get('/api/v1/users/123/profile')
  expect(res.status).toBe(200)
  expect(res.body.name).toBe('Alice')
})

test('fake route returns convincing response', async () => {
  const res = await request(app).get('/api/v1/orders/export')
  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('status')
})

test('fake route fires an alert', async () => {
  const alerts = []
  deadcode.onAlert(a => alerts.push(a))
  await request(app).get('/api/v1/orders/export')
  expect(alerts.length).toBe(1)
  expect(alerts[0].trap).toContain('export')
})

test('CRITICAL — zero alerts on normal user requests', async () => {
  const alerts = []
  deadcode.onAlert(a => alerts.push(a))

  for (let i = 0; i < 10; i++) {
    await request(app).get(`/api/v1/users/${i}/profile`)
    await request(app).post('/api/v1/auth/login')
    await request(app).get('/api/v1/orders')
  }

  expect(alerts.length).toBe(0)
})