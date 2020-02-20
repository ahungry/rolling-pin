# Rolling Pin


Flatten out nasty nested JSON into something simpler and smoother.

Interactively (GUI) turn this:

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

# License

Copyright © 2020 Matthew Carter <m@ahungry.com>

Distributed under the GNU Affero General Public License version 3.0 (AGPLv3).

See [LICENSE](https://github.com/ahungry/rolling-pin/blob/master/LICENSE) for details and exceptions.
