const assert = require('assert')

const mw = require('../lib/mw')

assert.equal(1, 1)

const basicHandler = handler => req => {
  const res = handler(req)

  return {
    ...res,
    headers: null,
    body: req.body.x + req.body.y,
  }
}

const req = {
  headers: {
    'X-Foo': 'Bar',
  },
  postData: JSON.stringify({
    x: 1,
    y: 2,
  }),
}

// Essentially the same
const c1 = mw.wrapCors(mw.wrapJsonReq(basicHandler(x => x)))
const c2 = [
  mw.wrapCors,
  mw.wrapJsonReq,
  basicHandler(x => x),
].reverse().reduce((acc, cur) => cur(acc))

assert.deepEqual(
  c1(req),
  { body: 3, headers: { 'Access-Control-Allow-Origin': '*' } },
)

assert.deepEqual(
  c2(req),
  { body: 3, headers: { 'Access-Control-Allow-Origin': '*' } },
)
