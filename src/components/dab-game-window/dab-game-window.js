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
      background-color: #fff;
      overflow: hidden;
      border-radius: 7px;
      touch-action: none;
      box-shadow: 5px 5px 15px rgba(119, 119, 119, 0.5);
    }

    .game-window-wrapper-topbar {
      background: rgb(131,58,180);
      background-image: linear-gradient( 110deg, var(--bg-color-primary) 0%, var(--bg-color-secondary) 50%, var(--bg-color-tertiary) 89% );
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
      this._cancelButton.addEventListener('click', this._closeApplication)
      this.addEventListener('click', this._setElementActive)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._topbar.removeEventListener('mousedown', this._dragStart, false)
      this._cancelButton.removeEventListener('click', this._closeApplication)
      this.removeEventListener('click', this._setElementActive)
    }

    /**
     * @param event
     */
    _dragStart (event) {
      // If the user clicks the cancel-button we close application directly to prevent glitch. 
      if(event.target.classList.contains('cancel-button')) {
        return this._closeApplication
      }

      let shiftX = event.clientX - event.target.getBoundingClientRect().left;
      let shiftY = event.clientY - event.target.getBoundingClientRect().top;
      
      function moveAt(pageX, pageY) {
        event.target.style.left = pageX - shiftX + 'px';
        event.target.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }
      
      event.target.parentNode.style.position = 'absolute'
      event.target.parentNode.style.zIndex = 1000;

      document.addEventListener('mousemove', onMouseMove);

      event.target.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        event.target.onmouseup = null;
      };
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
