// Way to have a Clojure ring-like middleware

const hasPostData = req => false === [undefined, null, ''].includes(req.postData)

// Demonstrates modifying the request itself
function wrapJsonReq (handler) {
  return function (req) {
    const res = hasPostData(req)
      ? handler({ ...req, body: JSON.parse(req.postData) })
      : handler(req)

    return res
  }
}

// Demonstrates modifying the outgoing response itself.
function wrapCors (handler) {
  return function (req) {
    const res = handler(req)

    return {
      body: res.body,
      headers: {
        ...res.headers,
        'Access-Control-Allow-Origin': '*',
      }
    }
  }
}

module.exports = {
  wrapCors,
  wrapJsonReq,
}
