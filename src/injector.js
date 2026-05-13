const { v4: uuid } = require('uuid')
const { fireAlert } = require('./alertEngine')

function fakeResponse(path) {
  if (path.includes('export') || path.includes('dump')) {
    return { status: 'queued', jobId: uuid(), estimatedTime: '2m' }
  }
  if (path.includes('backup')) {
    return { status: 'initiated', backupId: uuid() }
  }
  if (path.includes('admin')) {
    return { users: [], total: 0, page: 1 }
  }
  return { status: 'ok', requestId: uuid() }
}

function injectTraps(app, decoys) {
  for (const decoy of decoys) {
    const { method, path } = decoy
    const trapName = `${method}:${path}`

    app[method.toLowerCase()](path, (req, res) => {
      fireAlert({
        trap: trapName,
        method: req.method,
        path: req.path,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        headers: req.headers,
        body: req.body
      })

      const delay = Math.floor(Math.random() * 200) + 80
      setTimeout(() => {
        res.status(200).json(fakeResponse(path))
      }, delay)
    })
  }
}

module.exports = { injectTraps }