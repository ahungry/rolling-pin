// Handle the transformation logic.

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

function getVal (m, path) {
  try {
    return path.split('.').reduce((acc, cur) => acc[cur], m)
  } catch (_) {
    return null
  }
}

function setVal (m, path, val) {
  const keys = path.split('.')
  let next = m

  for (let i = 0; i < keys.length - 1; i++) {
    next = next[keys[i]]
  }

  // Stop at the last object, as those are by reference, while individual keys are not.
  next[keys.reverse().slice(0, 1)] = val
}

function transform (mapping) {
  return function (a) {
    let out = {}

    mapping.forEach(([apath, bpath]) => {
      const val = getVal(a, apath)

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