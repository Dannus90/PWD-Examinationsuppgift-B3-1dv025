/**
 * The game-window web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #game-window-wrapper {
      width: 600px;
      height: 400px;
      background-color: #fff;
      overflow: hidden;
      border-radius: 7px;
      touch-action: none;
    }

    .game-window-wrapper-topbar {
      background-color: #292aa8;
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      touch-action: none;
      user-select: none;
    }

    .cancel-button {
      position: relative;
      width: 25px;
      height: 25px;
      border-radius: 5px;
      background-color: #fff;
      cursor:pointer;
      margin-right: 10px;
      outline: none;
      border: none;
    }

    .cancel-button:active {
      transform: scale(0.975)
    }

    .cancel-button:after {
      position: absolute;
      top: 3px;
      bottom: 0;
      left: 11px;
      right: 0;
      content: '';
      transform: rotate(45deg);
      height: 20px;
      width: 3px;
      border-radius: 3px;
      background-color: #000;
    }

    .cancel-button:before {
      position: absolute;
      top: 3px;
      bottom: 0;
      left: 11px;
      right: 0;
      content: '';
      transform: rotate(-45deg);
      height: 20px;
      width: 3px;
      border-radius: 3px;
      background-color: #2b2b2b;
    }
  </style>

  <div id="game-window-wrapper">
    <div class="game-window-wrapper-topbar">
      <button class="cancel-button"></button>
    </div>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-game-window',
  /**
   * Class extending HTMLElement.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Selecting the window wrapper.
      this._windowWrapper = document.querySelector('#game-window-wrapper')

      // Selecting the top bar.
      this._topbar = document.querySelector('.game-window-wrapper-topbar')

      // Selecting the cancel button.
      this._cancelButton = document.querySelector('.cancel-button')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)