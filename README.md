# Rolling Pin

Flatten out nasty nested JSON into something simpler and smoother.

Try it out at: http://rolling-pin.ahungry.com/

Interactively (GUI or code lib) turn this:

```json
{
  "person": {
    "identifyingInformation": {
      "hint": "Click 'name' and enter name in the prompt, then 'uuid' and enter 'id'.",
      "fullName": "Matthew Carter",
      "uuid": "abc-123"
    },
    "physicalCharacteristics": {
      "head": {
        "eyes": {
          "left": {
            "hint": "Click 'color' and enter 'leftEye' in the prompt.",
            "color": "blue"
          },
          "right": {
            "hint": "Click 'color' and enter 'rightEye' in the prompt.",
            "color": "blue"
          }
        }
      }
    }
  }
}
```

into this:

```json
{
  "name": "Matthew Carter",
  "id": "abc-123",
  "leftEye": "blue",
  "rightEye": "blue"
}
```

With two-way data-mapping.

# Libs

You can clone this repo and use lib/transform.js in your own codebase
as such (will be published on npm soon):

```javascript
const { transform } = require('./lib/transform')

const mapping = [
  ['headers.Host'  , 'host'],
  ['origin'        , 'origin'],
  ['json.sentinel' , 'sentinel'],
]
const t = transform(mapping)

const x = t({
  headers: { Host: 'some-host' },
  origin: 'some-origin',
  json: { sentinel: 'some-sentinel' },
})

// Which will produce x as follows:
{
  host: 'some-host',
  origin: 'some-origin',
  sentinel: 'some-sentinel'
}

```

# License

Copyright © 2020 Matthew Carter <m@ahungry.com>

Distributed under the GNU General Public License version 3.0 (GPLv3).

See [LICENSE](https://github.com/ahungry/rolling-pin/blob/master/LICENSE) for details and exceptions.
