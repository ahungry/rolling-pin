const fs = require('fs')
const http = require('http')

console.log('Running on port 12345')
console.log('Try visiting http://0.0.0.0:12345')

// cb of the err, data format
function slurp (filename, cb) {
  fs.readFile(filename, { encoding: 'utf-8' }, cb)
}

function handler (url) {
  switch (url) {
    case '/version': return cb => cb(undefined, '0.0.1')
    case '/index.js': return cb => slurp('index.js', cb)
    case '/main.css': return cb => slurp('main.css', cb)
    case '/':
    default:
      return cb => slurp('index.html', cb)
  }
}

//create a server object:
http.createServer(function (req, res) {
  const { url } = req
  console.log('Got a req on: ', { url })

  handler(url)((_err, data) => {
    res.write(data)
    res.end()
  })

  // res.write(JSON.stringify({ x: 1 }))
  // res.end()
}).listen(12345)
