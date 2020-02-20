const flatJson = {}
const jsonFile = document.getElementById('json-file')
const pathAliases = []
let json = {
  "person": {
    "identifyingInformation": {
      "hint": "Click 'name' and enter name in the prompt, then 'uuid' and enter 'id'.",
      "fullName": "Matthew Carter",
      "uuid": "abc-123"
    },
    "head": {
      "eyes": [
        {
          "hint": "click 'color' and enter leftEyeColor in the prompt",
          "type": "left",
          "color": "blue"
        },
        {
          "hint": "click 'color' and enter rightEyeColor in the prompt",
          "type": "right",
          "color": "blue"
        }
      ],
      "ears": [
        {
          "hint": "click 'size' and enter leftEarSize in the prompt",
          "type": "left",
          "size": "medium"
        },
        {
          "hint": "click 'size' and enter rightEarSize in the prompt",
          "type": "right",
          "size": "medium"
        }
      ]
    },
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

function loadedJsonOnClick (e) {
  const path = e.target.title
  const alias = prompt('Choose your new path: ', path.replace(/\./g, '_'))
  pathAliases.push([path, alias])
  const val = makeVal(json, path)

  flatJson[alias] = val
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
  const keys = Object.keys(m)

  keys.forEach(k => {
    const el = document.createElement('div')
    const val = m[k]

    el.title = [...path, k].join('.')
    el.className = 'tree-key'
    el.innerHTML = `"${k}": `

    el.onmouseover = (e) => {
      e.stopPropagation()
      e.target.className = 'tree-key tk-active'
    }

    el.onmouseout = (e) => {
      e.stopPropagation()
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
      el.innerHTML += `"${val}"`
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

function boot () {
  jsonFile.addEventListener('change', function (e) {
    console.debug('jsonFile change', { e })

    const files = this.files

    console.debug('received some files: ', files.length)

    const fr = new FileReader()

    fr.onload = function (e) {
      console.debug('Got event: ', { e })
      console.debug('Got content: ', { text: e.target.result })
      const { result } = e.target

      json = JSON.parse(result)
      renderJson()
    }

    fr.readAsText(files[0])

  }, false)

  renderJson()
}

window.onload = () => boot()
