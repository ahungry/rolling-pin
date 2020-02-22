const fs = require('fs')

const { app } = require('./lib/app')
const { proxy } = require('./lib/proxy')

console.log('Running on port 12345')
console.log('Try visiting http://0.0.0.0:12345')

// cb of the err, data format
function slurp (filename, cb) {
  fs.readFile(filename, { encoding: 'utf-8' }, cb)
}

function handler (url, req = undefined) {
  switch (url) {
    case '/version': return cb => cb(undefined, '0.0.1')
    case '/index.js': return cb => slurp('index.js', cb)
    case '/main.css': return cb => slurp('main.css', cb)
    case '/':
      return cb => slurp('index.html', cb)
    default:
      return /\/http/.test(url)
        ? cb => proxy(url, req, cb)
        : cb => slurp('index.html', cb)
  }
}

app(12345, handler)
