// BEGIN from lib/transform
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

// END from lib/transform

let lastUploadedName = 'sample.json'
let flatJson = {}
let pathAliases = []
const jsonFile = document.getElementById('json-file')
let json = {
  "person": {
    "info": {
      "fullName": "Matthew Carter",
      "uuid": "abc-123"
    },
    "physical": {
      "head": {
        "eyes": {
          "left": {
            "color": "blue"
          },
          "right": {
            "color": "blue"
          }
        }
      }
    }
  }
}

function makeVal (m, path) {
  const keys = path.split('.')

  return keys.reduce((acc, cur) => acc[cur], m)
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

function upFirst (s) {
  const first = s[0].toUpperCase()

  return first + s.slice(1)
}

function getDefaultAlias (path) {
  const node = document.getElementById('auto-name')
  const autoName = node.value
  const parts = path.split('.')
  const ctxLevel = Number(document.getElementById('short-context-level').value)

  switch (autoName) {
    case 'short-snake':
      const shortParts1 = parts.reverse().slice(0, ctxLevel).reverse()

      return shortParts1.join('_')

    case 'short-camel':
      const shortParts = parts.reverse().slice(0, ctxLevel).reverse()

      return shortParts[0] + shortParts.slice(1).map(upFirst).join('')

    case 'long-snake':
      return parts.join('_')

    case 'long-camel':
      return parts[0] + parts.slice(1).map(upFirst).join('')

    case 'short':
    default:
      return parts.reverse().slice(0, 1)
  }
}

function loadedJsonOnClick (e) {
  // if ('INPUT' !== e.target.tagName) return
  const path = e.target.title
  const val = makeVal(json, path)

  // if ('object' === typeof val) {
  //   // alert('Only scalars supported for now, please try clicking the end of a branch/set of nodes.')

  //   return
  // }

  const alias = prompt(
    'Choose your new path: ',
    getDefaultAlias(path),
  )

  if (null === alias) return

  pathAliases.push([path, alias])
  flatJson = transform(pathAliases)(json)
  //flatJson[alias] = val
  renderFlatJson()
  renderAliases()
}

function getOriginalPath (path) {
  let orig = ''

  pathAliases.forEach(([a, b]) => {
    if (b === path) {
      orig = a
    }
  })

  return orig
}

function flatJsonOnClick (e) {
  if ('INPUT' !== e.target.tagName) return
  const path = e.target.title
  const val = makeVal(flatJson, path)
  const newVal = prompt('Choose a new value to set this to: ', val)
  const origPath = getOriginalPath(path)

  setVal(flatJson, path, newVal)
  setVal(json, origPath, newVal)
  renderJson()
  renderFlatJson()
}

function renderTree (onClick, parent, m, path = []) {
  if ('object' !== typeof m || null === m) return

  const keys = Object.keys(m)

  keys.forEach(k => {
    if ('' === k) return
    const el = document.createElement('div')
    const val = m[k]
    const title = [...path, k].join('.')

    el.title = title
    el.className = 'tree-key'
    el.innerHTML = `"${k}": `

    el.onmouseover = (e) => {
      // e.stopPropagation()
      e.target.className = 'tree-key tk-active'
    }

    el.onmouseout = (e) => {
      // e.stopPropagation()
      e.target.className = 'tree-key'
    }

    el.onclick = onClick

    parent.appendChild(el)

    if ('object' === typeof val) {
      if (Array.isArray(val)) {
        el.innerHTML += '['
        renderTree(onClick, el, val, [...path, k])
        el.innerHTML += ']'
      } else {
        el.innerHTML += '{'
        renderTree(onClick, el, val, [...path, k])
        el.innerHTML += '}'
      }
    } else {
      // el.innerHTML += `"${val}" <input type="button" value="${val}" />`
      el.innerHTML += `"${val}" <input
  onmouseover="this.parentNode.className='tree-key tk-active'"
  onmouseout="this.parentNode.className='tree-key'"
  class="tree-key"
  title="${title}" type="button" value="${title}" />`
    }
  })
}

function renderJson () {
  const node = document.getElementById('code')
  node.innerHTML = ''

  renderTree(loadedJsonOnClick, node, json)
}

function renderFlatJson () {
  const node = document.getElementById('clean-code')
  node.innerHTML = ''

  renderTree(flatJsonOnClick, node, flatJson)
}

function renderAliases () {
  const node = document.getElementById('aliases')
  node.innerHTML = ''

  pathAliases.forEach(alias => {
    const el = document.createElement('div')
    el.innerHTML = JSON.stringify(alias)

    node.appendChild(el)
  })
}

function sendFile (fileData, fileName) {
  const blob = new Blob(
    [fileData],
    {
      type: "text/plain;charset=utf-8",
    },
  )
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    URL.createObjectURL(blob),
  )
  element.setAttribute('download', fileName)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function downloadAliases () {
  sendFile(JSON.stringify(pathAliases, null, 4), 'aliases-for-' + lastUploadedName)
}

function boot () {
  jsonFile.addEventListener('change', function (e) {
    console.debug('jsonFile change', { e })

    const files = this.files

    console.debug('received some files: ', files.length)
    lastUploadedName = e.target.value.split('\\').reverse()[0]

    const fr = new FileReader()

    fr.onload = function (e) {
      console.debug('Got event: ', { e })
      console.debug('Got content: ', { text: e.target.result })
      const { result } = e.target

      json = JSON.parse(result)
      flatJson = {}
      pathAliases = []

      renderJson()
      renderFlatJson()
    }

    fr.readAsText(files[0])

  }, false)

  renderJson()
}

window.onload = () => boot()
