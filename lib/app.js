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
  }).listen(port)
}

module.exports = { app }
