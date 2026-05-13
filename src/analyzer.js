const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

function analyzeRoutes(appFilePath) {
  const code = fs.readFileSync(appFilePath, 'utf8')
  const ast = parser.parse(code, { sourceType: 'module', ecmaVersion: 'latest' })

  const routes = []

  traverse(ast, {
    CallExpression(nodePath) {
      const { callee, arguments: args } = nodePath.node
      const httpMethods = ['get', 'post', 'put', 'delete', 'patch']
      if (callee.type !== 'MemberExpression') return
      if (!httpMethods.includes(callee.property.name)) return
      if (!args[0] || args[0].type !== 'StringLiteral') return

      routes.push({
        method: callee.property.name.toUpperCase(),
        path: args[0].value
      })
    }
  })

  return routes
}

function generateDecoys(realRoutes) {
  const attackerSuffixes = [
    '/export', '/dump', '/backup',
    '/admin', '/internal', '/all'
  ]

  const decoys = []

  for (const route of realRoutes) {
    const base = route.path.replace(/\/:[^/]+/g, '')
    for (const suffix of attackerSuffixes.slice(0, 2)) {
      const fakePath = base + suffix
      const alreadyReal = realRoutes.some(r => r.path === fakePath)
      if (!alreadyReal) {
        decoys.push({ method: route.method, path: fakePath })
      }
    }
  }

  return decoys
}

module.exports = { analyzeRoutes, generateDecoys }