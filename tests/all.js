const assert = require('assert')

const proxy = require('../lib/proxy')

assert.equal(1, 1)

assert.deepEqual(
  proxy.makeOpts('/http://example.com/test'),
  {
    protocol: 'http',
    hostname: 'example.com',
    path: '/test',
  },
)

assert.deepEqual(
  proxy.makeOpts('/https://example.com'),
  {
    protocol: 'https',
    hostname: 'example.com',
    path: '',
  },
)
