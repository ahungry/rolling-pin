const jsonFile = document.getElementById('json-file')
let json = {
  "app": {
    "name": "My Test",
    "date": "Today"
  }
}

function renderJson () {
  const node = document.getElementById('code')

  node.innerHTML = JSON.stringify(json, undefined, 4)
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
