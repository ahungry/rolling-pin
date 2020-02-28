// Handle the transformation logic.

const _sampleMapping = [
  ['x', 'y'],
  ['foo.bar.baz', 'fooBarBaz'],
]

function makePath (m, path) {
  const keys = path.split('.')
  let node = m

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]

    if (undefined === node[k]) {
      node[k] = {}
    }

    node = node[k]
  }

  return m
}

function getVal (m, path, def = null) {
  try {
    return path.split('.').reduce((acc, cur) => acc[cur], m) || def
  } catch (_) {
    return def
  }
}

function setVal (m, path, val) {
  const keys = path.split('.')
  let next = m

  for (let i = 0; i < keys.length - 1; i++) {
    next = next[keys[i]]
  }

  // Stop at the last object, as those are by reference, while individual keys are not.
  next[keys.reverse().slice(0, 1)] = undefined === val ? null : val
}

function transform (mapping) {
  return function (a) {
    let out = {}

    mapping.forEach(([apath, bpath, def]) => {
      const val = getVal(a, apath, def)

      makePath(out, bpath)
      setVal(out, bpath, val)
    })

    return out
  }
}

module.exports = {
  getVal,
  makePath,
  transform,
}
