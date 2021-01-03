# &lt;dab-application-icon&gt;

This is a web component simulating a application icon. It is used to initiate new instances of applications.

## Attributes

### `name`

A string representing the name of the application.

Default value: An empty string.

### `src`

A string representing image to be used by the application icon.

Default value: An empty string.

## Methods

No public methods are meant to be used for this component!

## Custom Events

| Event Name             |  Fired When                                                |
| ---------------------- | ---------------------------------------------------------- |
| `createNewAppInstance` | An event that initiates the creating of a new app instace. |

## Styling with CSS

Styling with css is done from within the template in the custom element. Some styles are also applied through styles.css in public css folder.

## Example

```html
<dab-application-icon
  src="./assets/object-detection-application-icon.jpg"
  name="dab-object-detection-application"
/>
```

![What the component looks like](./assets/IconExamples.png)
