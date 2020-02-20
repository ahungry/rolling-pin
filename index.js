const jsonFlat = {}
const jsonFile = document.getElementById('json-file')
let json = {
  "app": {
    "name": {
      "first": "My",
      "second": "App",
      "someArray": [1, 2, 3]
    },
    "date": "Today"
  }
}

function renderTree (parent, m, path = []) {
  const keys = Object.keys(m)

  keys.forEach(k => {
    const el = document.createElement('div')

    el.title = [...path, k].join('.')
    el.className = 'tree-key'
    el.innerHTML = k

    parent.appendChild(el)

    const val = m[k]

    if ('object' === typeof val) {
      renderTree(el, val, [...path, k])
    }
  })
}

function renderJson () {
  const node = document.getElementById('code')

  renderTree(node, json)
  // node.innerHTML = JSON.stringify(json, undefined, 4)
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
