const fs = require('fs')
const http = require('http')
const https = require('https')

console.log('Running on port 12345')
console.log('Try visiting http://0.0.0.0:12345')

// ex: /http://example.com/foo
function makeOpts (url) {
  const [_, protocol, hostname, path] = url.match(/\/(http[s]*?):\/\/(.*?)(\/(.*)|$)/)

  return {
    protocol,
    hostname,
    path,
  }
}

function proxy (url, req, cb) {
  const { hostname, path, protocol } = makeOpts(url)

  req.headers.host = hostname

  const options = {
    path: '/' + path,
    method: req.method,
    port: protocol === 'http' ? 80 : 443,
    hostname,
    headers: req.headers,
  }
  const { postData } = req

  console.log('proxy request to: ', { options })
  const client = protocol === 'http' ? http : https

  const request = client.request(options, function (res) {
    let content = ''

    res.setEncoding('utf8')

    res.on('data', (chunk) => {
      content += chunk
    })

    res.on('end', () => {
      cb(undefined, content)
    })
  })

  request.write(postData)
  request.end()
}

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
      return cb => proxy(url, req, cb)
  }
}

//create a server object:
http.createServer(function (req, res) {
  const { url } = req
  console.log('Got a req on: ', { url })

  let content = ''

  req.setEncoding('utf8')

  req.on('data', (chunk) => {
    content += chunk
  })

  req.on('end', () => {
    console.log('Got the data: ', { content })

    req.postData = content

    handler(url, req)((_err, data) => {
      res.write(data)
      res.end()
    })
  })

  // res.write(JSON.stringify({ x: 1 }))
  // res.end()
}).listen(12345)
