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

    req.on('end', async () => {
      console.log('Got the data: ', { content })

      // used so proxy can get it later on (or anyone else who needs it).
      req.postData = content

      const response = await handler(req)

      // Map over each header
      const headers = Object.keys(response.headers)

      headers.forEach(header => {
        res.setHeader(header, response.headers[header])
      })

      if ('application/json' === response.headers['content-type']) {
        res.write(JSON.stringify(response.body))
      } else {
        res.write(response.body)
      }

      res.end()
      // handler(req, res)((_err, data) => {
      //   res.setHeader('X-Server', 'rolling-pin')
      //   res.write(data)
      //   res.end()
      // })
    })
  }).listen(port)
}

module.exports = { app }
