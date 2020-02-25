const assert = require('assert')

const mw = require('../lib/mw')

assert.equal(1, 1)

function basicHandler (handler) {
  return async function (req) {
    const res = await handler(req)

    return {
      ...res,
      body: req.body.x + req.body.y,
    }
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
const c1 = mw.wrapJsonReq(basicHandler(mw.wrapCors(_ => ({}))))
const c2 = mw.wrapJsonReq(mw.wrapAsyncTest(mw.wrapCors(basicHandler(_ => ({})))))

const c3 = [
  mw.wrapCors,
  mw.wrapJsonReq,
  mw.wrapAsyncTest,
  basicHandler(mw.init),
].reverse().reduce((acc, cur) => cur(acc))

void async function main() {
  const result1 = await c1(req)

  assert.deepEqual(
    result1,
    { body: 3, headers: { 'Access-Control-Allow-Origin': '*' } },
  )

  const result2 = await c2(req)

  assert.deepEqual(
    result2,
    { body: 3, headers: { 'Access-Control-Allow-Origin': '*' }, slowness: 3 },
  )

  const result3 = await c3(req)

  assert.deepEqual(
    result3,
    { body: 3, headers: { 'Access-Control-Allow-Origin': '*' }, slowness: 3 },
  )

  console.log('all done!')
}().catch(console.error)
