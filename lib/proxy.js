const http = require('http')
const https = require('https')

/**
 * Generate options
 *
 * @param {string} url
 */
function makeOpts (url) {
  const [_, protocol, hostname, path] = url.match(/\/(http[s]*?):\/\/(.*?)(\/(.*)|$)/)

  return {
    protocol,
    hostname,
    path,
  }
}

/**
 * Proxy a request to a remote.
 *
 * @param {string} url
 * @param {http.Request} req
 * @param {(err, string) => void} cb
 */
function proxy (url, req, cb) {
  const { hostname, path, protocol } = makeOpts(url)

  req.headers.host = hostname

  const options = {
    path,
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

module.exports = {
  makeOpts,
  proxy,
}
