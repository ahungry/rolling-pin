const http = require('http')

/**
 * Basic webserver.
 *
 * @param {number} port
 * @param {(string, http.Request) => (err, string) => void} handler
 */
function app (port, handler) {
  //create a server object:
  http.createServer(function (req, res) {
    let content = ''

    req.setEncoding('utf8')

    req.on('data', (chunk) => {
      content += chunk
    })

    req.on('end', () => {
      console.log('Got the data: ', { content })

      // used so proxy can get it later on (or anyone else who needs it).
      req.postData = content

      handler(req, res)((_err, data) => {
        res.setHeader('X-Server', 'rolling-pin')
        res.write(data)
        res.end()
      })
    })
  }).listen(port)
}

module.exports = { app }
