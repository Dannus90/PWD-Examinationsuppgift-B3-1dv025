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
      cursor: grab;
    }
    
    .game-window-wrapper-topbar:active {
      cursor: grabbing;
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
    <slot name="application-container" />
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
      this._windowWrapper = this.shadowRoot.querySelector('#game-window-wrapper')

      // Selecting the top bar.
      this._topbar = this.shadowRoot.querySelector('.game-window-wrapper-topbar')

      // Selecting the cancel button.
      this._cancelButton = this.shadowRoot.querySelector('.cancel-button')

      // Position related variables.
      this._active = false
      this._currentX
      this._currentY
      this._initialX
      this._initialY
      this._xOffset = 0
      this._yOffset = 0

      // Binding this to class methods.
      this._dragStart = this._dragStart.bind(this)

      this._dragEnd = this._dragEnd.bind(this)

      this._drag = this._drag.bind(this)

      this._closeApplication = this._closeApplication.bind(this)

      this.setZIndex = this.setZIndex.bind(this)

      this._setElementActive = this._setElementActive.bind(this)
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
      this._topbar.addEventListener('mousedown', this._dragStart, false)
      this._topbar.addEventListener('mouseup', this._dragEnd, false)
      this._topbar.addEventListener('mouseleave', this._dragEnd, false)
      this._topbar.addEventListener('mousemove', this._drag, false)
      this.addEventListener('doneMoving', this._dragEnd, false)
      this._cancelButton.addEventListener('click', this._closeApplication)
      this.addEventListener('click', this._setElementActive)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._topbar.removeEventListener('mousedown', this._dragStart, false)
      this._topbar.removeEventListener('mouseup', this._dragEnd, false)
      this._topbar.removeEventListener('mouseleave', this._dragEnd, false)
      this._topbar.removeEventListener('mousemove', this._drag, false)
      this.removeEventListener('doneMoving', this._dragEnd, false)
      this._cancelButton.removeEventListener('click', this._closeApplication)
      this.removeEventListener('click', this._setElementActive)
    }

    /**
     * @param event
     */
    _dragStart (event) {
      this._initialX = event.clientX - this._xOffset
      this._initialY = event.clientY - this._yOffset

      this.dispatchEvent(new window.CustomEvent('elementInFocus', {
        bubbles: true,
        composed: true,
        detail: {
          currentInstance: this
        }
      }))

      this.style.zIndex = 1000

      if (event.target === this._topbar) {
        this._active = true
      }
    }

    /**
     * @param event
     */
    _dragEnd (event) {
      this._initialX = this._currentX
      this._initialY = this._currentY

      this._active = false
    }

    /**
     * @param event
     */
    _drag (event) {
      if (this._active) {
        event.preventDefault()

        this._setTranslate((event.clientX - this._initialX), (event.clientY - this._initialY), this._windowWrapper)

        this._currentX = event.clientX - this._initialX
        this._currentY = event.clientY - this._initialY

        this._xOffset = this._currentX
        this._yOffset = this._currentY
      }
    }

    /**
     * @param posX
     * @param posY
     * @param elem
     */
    _setTranslate (posX, posY, elem) {
      elem.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
    }

    /**
     * @param currentInstance
     */
    setZIndex (currentInstance) {
      if (this === currentInstance) {
        return this.style.zIndex = 1000
      }
      this.style.zIndex = 1
    }

    /**
     *
     */
    _setElementActive () {
      this.dispatchEvent(new window.CustomEvent('elementInFocus', {
        bubbles: true,
        composed: true,
        detail: {
          currentInstance: this
        }
      }))
    }

    /**
     *
     */
    _closeApplication () {
      this.dispatchEvent(new window.CustomEvent('deleteAppInstance', {
        bubbles: true,
        composed: true,
        detail: {
          applicationName: this
        }
      }))
    }
  }
)
