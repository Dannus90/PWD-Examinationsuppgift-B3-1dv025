# &lt;dab-pwd-application&gt;

This is a web component simulating a quiz-application. It is the main component in this application surround the other web components.

## Attributes

### `name`

A string representing the name of the application.

Default value: "Personal Web Desktop"

### `src`

A string representing the background image of the application.

Default value: None

## Methods

This component have no public methods.

## Slot

Has three slots. One for the main application with the name application. One for application icons with the name application-icon. One with the name application-clock for the application-clock.

## Custom Events

This component does not have any dispatched custom events.

## Styling with CSS

Styling with css is done from within the template in the custom element. Some styles are also applied through styles.css in public css folder.

## Example

```html
<dab-pwd-application
  id="pwd-application"
  name="Your Personal Web Desktop Application"
  src="./assets/night-sky.jpg"
>
  <div slot="application-icon" id="memory-game-icon">
    <dab-application-icon
      src="./assets/memory-game-icon.png"
      name="dab-memory-game"
    />
  </div>
  <div slot="application-icon" id="chat-application-icon">
    <dab-application-icon
      src="./assets/chat-application-icon.svg"
      name="dab-chat-application"
    />
  </div>
  <div slot="application-icon" id="object-recognition-application-icon">
    <dab-application-icon
      src="./assets/object-detection-application-icon.jpg"
      name="dab-object-detection-application"
    />
  </div>
  <div slot="application-icon" id="bubble-shark-game-icon">
    <dab-application-icon
      src="./assets/shark-bubble-game-icon.png"
      name="dab-shark-bubble-game"
    />
  </div>
  <dab-digital-clock
    slot="application-clock"
    id="application-clock"
    name="dab-digital-clock"
  />
</dab-pwd-application>
```

![What the component looks like](./assets/MainApplication.png)
