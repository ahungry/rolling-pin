// Way to have a Clojure ring-like middleware

const hasPostData = req => false === [undefined, null, ''].includes(req.postData)

// Demonstrates modifying the request itself
function wrapJsonReq (handler) {
  return function (req) {
    const nextReq = hasPostData(req)
      ? { ...req, body: JSON.parse(req.postData) }
      : req

    return handler(nextReq)
  }
}

// Demonstrates modifying the outgoing response itself.
function wrapCors (handler) {
  return async function (req) {
    const res = await handler(req)

    return {
      ...res,
      body: res.body,
      headers: {
        ...res.headers,
        'Access-Control-Allow-Origin': '*',
      }
    }
  }
}

function wrapAsyncTest (handler) {
  return async function (req) {
    const res = await handler(req)

    const slowness = await new Promise((resolve, _) => {
      setTimeout(() => resolve(3), 500)
    })

    return {
      ...res,
      slowness,
    }
  }
}

function init () {
  return {}
}

module.exports = {
  init,
  wrapAsyncTest,
  wrapCors,
  wrapJsonReq,
}
