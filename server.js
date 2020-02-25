const fs = require('fs')

const { app } = require('./lib/app')
const mw = require('./lib/mw')
const { proxy } = require('./lib/proxy')
const { transform } = require('./lib/transform')

console.log('Running on port 12345')
console.log('Try visiting http://0.0.0.0:12345')

// cb of the err, data format
async function slurp (filename) {
  const p = await new Promise((resolve, reject) => {
    fs.readFile(filename, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(err)

      resolve(data)
    })
  })

  return p
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
    ['origin', 'my-origin'],
  ]
  const t = transform(mapping)

  return function (err, data) {
    console.log('PROXY IS SENDING OUT: ', { data })

    const x = t(JSON.parse(data))

    console.log('PROXY AFTER TRANSFORM IS: ', { x })

    cb(err, {
      headers: {
        'content-type': 'application/json',
      },
      body: x
    })
    // cb(err, JSON.stringify(x))
  }
}

function route (handler) {
  return async function (req) {
    const res = await handler(req)
    const { url } = req

    switch (url) {
      case '/version':
        return {
          ...res,
          headers: {
            ...res.headers,
            'content-type': 'application/json',
          },
          body: {
            version: '0.0.1',
          }
        }

        // Just load the basic file.
      case '/iosevka-term-regular.woff':
      case '/index.js':
      case '/main.css':
        return {
          ...res,
          body: await slurp(url.slice(1)),
        }
        // return cb => slurp(url.slice(1), cb)

      case '/':
        return {
          ...res,
          body: await slurp('index.html')
        }

      default:
        return /\/http/.test(url)
          ? await evalProxy(url, req)
          : { ...res, body: await slurp('index.html') }
    }
  }
}

async function evalProxy (url, req) {
  const result = await new Promise((resolve, reject) => {
    proxy(url, req, postProxy((err, data) => {
      if (err) reject(err)
      resolve(data)
    }))
  })

  console.log('evalProxy result is: ', { result })

  return result
}

// app(12345, wrapJson(wrapLog(handler)))
app(12345, mw.wrapCors(mw.wrapJsonReq(route(mw.init))))
