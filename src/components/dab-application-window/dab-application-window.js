/**
 * The application-window web component module.
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
    #window-wrapper {
      background-color: #fff;
      border-radius: 7px;
      touch-action: none;
      box-shadow: 1px 1px 12px -6px rgba(183, 176, 176, 0.5);
      position: absolute;
      top: 50%;
      left: 50;
      transform: translate(-50%, -50%);
    }

    .window-wrapper-topbar {
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
    
    .window-wrapper-topbar:active {
      cursor: grabbing;
    }

    .cancel-button {
      position: relative;
      width: 25px;
      height: 25px;
      border-radius: 3px;
      background-color: #fff;
      cursor:pointer;
      margin-right: 10px;
      outline: none;
      border: none;
    }

    .cancel-button:active {
      transform: scale(0.975)
    }

    .cancel-button:focus-visible {
      outline: 3px solid orangered;
    }

    .cancel-button:-moz-focusring {
      outline: 3px solid orangered;
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
      background-color: #2b2b2b;
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

  <div id="window-wrapper">
    <div class="window-wrapper-topbar">
      <button class="cancel-button" tabindex="0"></button>
    </div>
    <slot name="application-container" />
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-application-window',
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
      this._windowWrapper = this.shadowRoot.querySelector('#window-wrapper')

      // Selecting the top bar.
      this._topbar = this.shadowRoot.querySelector('.window-wrapper-topbar')

      // Selecting the cancel button.
      this._cancelButton = this.shadowRoot.querySelector('.cancel-button')

      // Position related variables.
      this._active = false
      this._currentX = 0
      this._currentY = 0
      this._initialX = 0
      this._initialY = 0
      this._xOffset = 0
      this._yOffset = 0

      // Binding this to component methods.
      this._closeApplication = this._closeApplication.bind(this)
      this._dragStart = this._dragStart.bind(this)
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
     * This methods runs when the top bar is clicked.
     *
     * @param {object} event The event object.
     * @returns {Function} A function that closes the application or nothing.
     */
    _dragStart (event) {
      // If the user clicks the cancel-button we close application directly to prevent glitch.
      if (event.target.classList.contains('cancel-button')) {
        return this._closeApplication
      }

      const shiftX = event.clientX - event.target.getBoundingClientRect().left
      const shiftY = event.clientY - event.target.getBoundingClientRect().top
      let currentLeft = 0
      let currentRight = 0
      const currentWindowWidth = event.target.getBoundingClientRect().width

      /**
       * A function that moves the current element by changing styling on it.
       *
       * @param {number} pageX A number regarding the current position on the page.
       * @param {number} pageY A number regarding the current position on the page.
       * @param {HTMLElement} movedElement The currently moved element.
       */
      function moveAt (pageX, pageY, movedElement) {
        // --- FOR FIREFOX --- //
        if(navigator.userAgent.indexOf("Firefox") !== -1) {
          console.log(currentLeft)
          if (pageX === 0 && movedElement.offsetLeft !== undefined) {
            currentLeft = movedElement.offsetLeft
          }

          if (pageX === document.documentElement.clientWidth - 5) {
            currentRight = movedElement.offsetLeft
          }
  
          // --- We make all these checks to have the same functionality as a desktop and also to work even when having console up and shrinking screen. --- //
  
          if (pageX >= document.documentElement.clientWidth) {
            // This one runs when reaching the right side of the page.
            console.log('Right')
            if (!(pageY < 0)) {
              event.target.style.left = currentRight + 'px'
            } else {
              currentRight = document.documentElement.clientWidth - currentWindowWidth
              event.target.style.left = document.documentElement.clientWidth - currentWindowWidth + 'px'
            }
  
            if (movedElement.offsetTop === 0 && pageY < 30) {
              event.target.style.top = 0 + 'px'
            } else if (movedElement.offsetTop === 0 && (document.documentElement.clientHeight - pageY) < 30) {
              event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
            } else {
              event.target.style.top = pageY - shiftY + 'px'
            }
          } else if (pageX <= 0) {
            // This one runs when reaching the left side of the page.
            event.target.style.left = currentLeft + 'px'
            
            if ((document.documentElement.clientHeight - pageY) < 40) {
              event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
            } else {
              console.log('Left3')
              event.target.style.top = pageY - shiftY + 'px'
            }
          } else if (pageY < 30) {
            // This one runs when reaching the top of the page.
            console.log('Top')
            event.target.style.left = pageX - shiftX + 'px'
            event.target.style.top = 0 + 'px'
          } else if ((document.documentElement.clientHeight - pageY) < 40) {
            // This runs when we reach the bottom of the page.
            console.log('Bottom')
            currentLeft = pageX - shiftX 
            currentRight = document.documentElement.clientWidth - currentWindowWidth
            event.target.style.left = pageX - shiftX + 'px'
            event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
          } else {
            // The general running condition if none of above statements are applied.
            console.log('Default')
            event.target.style.left = pageX - shiftX + 'px'
            event.target.style.top = pageY - shiftY + 'px'
          }
        } else {
        // --- FOR OTHER BROWSERS ---//
        if (pageX === 0 && movedElement.offsetLeft !== 0) {
          currentLeft = movedElement.offsetLeft
        }
        console.log(document.documentElement.clientWidth)
        if (pageX === document.documentElement.clientWidth - 5) {
          currentRight = movedElement.offsetLeft
        }

        // --- We make all these checks to have the same functionality as a desktop and also to work even when having console up and shrinking screen. --- //

        if (pageX >= document.documentElement.clientWidth) {
          // This one runs when reaching the right side of the page.
          console.log('Right')
          if (!(pageY < 0)) {
            console.log("Right1")
            event.target.style.left = currentRight + 'px'
          } else {
            console.log("Right1")
      /*       currentRight = document.documentElement.clientWidth - currentWindowWidth */
            event.target.style.left = currentRight + 'px'
          }

          if (movedElement.offsetTop === 0 && pageY < 30) {
            event.target.style.top = 0 + 'px'
          } else if (movedElement.offsetTop === 0 && (document.documentElement.clientHeight - pageY) < 30) {
            event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
          } else {
            event.target.style.top = pageY - shiftY + 'px'
          }
        } else if (pageX <= 0) {
          // This one runs when reaching the left side of the page.
          event.target.style.left = currentLeft + 'px'
          console.log('Left')
          if (movedElement.offsetTop === 0 && pageY < 30) {
            event.target.style.top = 0 + 'px'
          } else if ((pageY - document.documentElement.clientHeight) > -39) {
            event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
          } else {
            event.target.style.top = pageY - shiftY + 'px'
          }
        } else if (movedElement.offsetTop === 0 && pageY < 30) {
          // This one runs when reaching the top of the page.
          console.log('Top')
          currentLeft = pageX - shiftX
          currentRight = pageX - shiftX
          event.target.style.left = pageX - shiftX + 'px'
          event.target.style.top = 0 + 'px'
        } else if (document.documentElement.clientHeight - (movedElement.offsetHeight + movedElement.offsetTop) < 40) {
          // This runs when we reach the bottom of the page.
          console.log('Bottom')
          currentLeft = pageX - shiftX 
          currentRight = pageX - shiftX
          event.target.style.left = pageX - shiftX + 'px'
          event.target.style.top = (document.documentElement.clientHeight - 39) + 'px'
        } else {
          // The general running condition if none of above statements are applied.
          console.log('Default')
          event.target.style.left = pageX - shiftX + 'px'
          event.target.style.top = pageY - shiftY + 'px'
        }
      }
      }

      /**
       * A function that calls the moveAt functions responsible for updating the position of the element.
       *
       * @param {object} event The even object containing the current position on the page.
       */
      function onMouseMove (event) {
        moveAt(event.pageX, event.pageY, event.target)
      }

      this.style.left = event.pageX - shiftX + 'px'
      this.style.top = event.pageY - shiftY + 'px'
      event.target.parentNode.style.transform = 'translate(0,0)'
      event.target.parentNode.style.zIndex = 1000

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove)
      })

      /**
       * A set of functions that removes the mousemove event listener and the onmouseup.
       */
      event.target.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove)
        event.target.onmouseup = null
      }

      event.target.addEventListener('click', () => {
        document.removeEventListener('mousemove', onMouseMove)
        event.target.onmouseup = null
      })
    }

    /**
     * The method dispatches an event that deletes the current app instance.
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
