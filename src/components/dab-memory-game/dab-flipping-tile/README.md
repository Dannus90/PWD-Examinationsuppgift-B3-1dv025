# &lt;dab-flipping-tile&gt;

This is a web component simulating a flipping-tile. It is a huge part of the memory game component.

## Attributes

### `backimage`

A string representing the backside image.

Default value: none

### `frontimage`

A string representing the frontimage image.

Default value: none

### `backalt`

A string representing the backalt.

Default value: none

### `frontalt`

A string representing the frontalt.

Default value: none

### `borderstyle`

A string representing the borderstyle.

Default value: none

### `disabled`

A boolean regarding the tile should be disabled or not.

Default value: false

### `hidden`

A boolean regarding the tile should be hidden or not.

Default value: false

### `face-up`

A boolean regarding the face is up or down on the tile.

Default value: false

## Methods

### `isEqual()`

This method compares the equality between two nodes.

### `cardMissMatch()`

This method contains the logic to be carried out when two cards does not match.

## Custom Events

| Event Name    |  Fired When                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `tileflipped` | Dispatches a tile flipped event with the faceup detail being true or false. |

## Styling with CSS

Styling with css is done from within the template in the custom element. Some styles are also applied through styles.css in public css folder.

## Example

It is created through a template in dab-memory-game component.

```html
  <template id="tile-template">
    <dab-flipping-tile tabindex="0" style=></dab-flipping-tile>
  </template>
```

![What the component looks like](./assets/FlippingBackside.png)
![What the component looks like](./assets/FlippingFrontside.png)
