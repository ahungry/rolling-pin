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

const transform = require('../lib/transform')

assert.deepEqual(
  transform.makePath({}, 'foo.bar.baz'),
  { foo: { bar: { baz: {} } } },
)

assert.deepEqual(
  transform.makePath({ foo: { bar: { baz: 3 } } }, 'foo.bar.baz'),
  { foo: { bar: { baz: 3 } } },
)

assert.deepEqual(
  transform.getVal({ foo: { bar: { baz: 3 } } }, 'foo.bar.baz'),
  3,
)

assert.deepEqual(
  transform.getVal({ foo: { bar: { baz: 3 } } }, 'foox.barx.bax'),
  undefined,
)

const mapping = [
  ['x', 'y'],
]

assert.deepEqual(
  transform.transform(mapping)({ x: 1 }),
  { y: 1 },
)

const mapping2 = [
  ['x', 'y'],
  ['foo.bar.baz', 'fooBarBaz'],
  ['foo.flub.baz', 'fooFlubBaz'],
]

assert.deepEqual(
  transform.transform(mapping2)({}),
  { y: null, fooBarBaz: null, fooFlubBaz: null },
)

assert.deepEqual(
  transform.transform(mapping2)({ foo: { bar: { baz: 55 } } }),
  { y: null, fooBarBaz: 55, fooFlubBaz: null },
)

const mapping3 = mapping2.map(x => [...x].reverse())

// Now test out the flipped map logic (other direction).
assert.deepEqual(
  transform.transform(mapping3)({}),
  { x: null, foo: { bar: { baz: null }, flub: { baz: null } } },
)

assert.deepEqual(
  transform.transform(mapping3)({ fooBarBaz: 55, fooFlubBaz: 32 }),
  { x: null, foo: { bar: { baz: 55 }, flub: { baz: 32 } } },
)
