const fs = require('fs')

const { app } = require('./lib/app')
const { proxy } = require('./lib/proxy')
const { transform } = require('./lib/transform')

console.log('Running on port 12345')
console.log('Try visiting http://0.0.0.0:12345')

// cb of the err, data format
function slurp (filename, cb) {
  fs.readFile(filename, { encoding: 'utf-8' }, cb)
}

// Wrap a function around the callback
function wrapJson (next) {
  return function (req) {
    // Modify request before routing layer.
    if ([undefined, null, ''].includes(req.postData)) {
      return next(req)
    }

    req.json = JSON.parse(req.postData)

    return next(req)
  }
}

const wrapLog = n => req => {
  const { json } = req

  console.log('JSON received: ', { json })

  return n(req)
}

function postProxy (cb) {
  // TODO: Just hardcoding a sample translator
  // curl http://0.0.0.0:12345/https://httpbin.org/post -XPOST -d '{"sentinel": 1}' -D-
  const mapping = [
    ['headers.Host', 'my-host'],
  ]
  const t = transform(mapping)

  return function (err, data) {
    console.log('PROXY IS SENDING OUT: ', { data })

    const x = t(JSON.parse(data))

    cb(err, JSON.stringify(x))
  }
}

function handler (req = undefined) {
  const { url } = req

  switch (url) {
    case '/version': return cb => cb(undefined, JSON.stringify({ version: '0.0.1' }))

    // Just load the basic file.
    case '/iosevka-term-regular.woff':
    case '/index.js':
    case '/main.css':
      return cb => slurp(url.slice(1), cb)

    case '/':
      return cb => slurp('index.html', cb)
    default:
      return /\/http/.test(url)
        ? cb => proxy(url, req, postProxy(cb))
        : cb => slurp('index.html', cb)
  }
}

app(12345, wrapJson(wrapLog(handler)))
