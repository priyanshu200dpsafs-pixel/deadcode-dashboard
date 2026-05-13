const alertHandlers = []
const alertLog = []

function onAlert(handler) {
  alertHandlers.push(handler)
}

function fireAlert(data) {
  const alert = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Math.random().toString(36).slice(2)
  }

  alertLog.push(alert)

  for (const handler of alertHandlers) {
    try { handler(alert) } catch (e) {}
  }

  console.warn(`\n[DEADCODE ALERT] Trap hit: ${data.trap} from IP ${data.ip}\n`)
}

function getAlertLog() { return alertLog }
function clearAlertLog() { alertLog.length = 0 }

module.exports = { onAlert, fireAlert, getAlertLog, clearAlertLog }