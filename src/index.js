const path = require('path')
const { analyzeRoutes, generateDecoys } = require('./analyzer')
const { injectTraps } = require('./injector')
const { onAlert, fireAlert, getAlertLog, clearAlertLog } = require('./alertEngine')

function protect(app, appFilePath) {
  const realRoutes = analyzeRoutes(appFilePath)
  console.log(`[DeadCode] Found ${realRoutes.length} real routes:`)
  realRoutes.forEach(r => console.log(`  ${r.method} ${r.path}`))

  const decoys = generateDecoys(realRoutes)
  injectTraps(app, decoys)
  console.log(`[DeadCode] Injected ${decoys.length} traps:`)
  decoys.forEach(d => console.log(`  ${d.method} ${d.path}`))

  return { realRoutes, decoys }
}

module.exports = { protect, onAlert, getAlertLog, clearAlertLog }