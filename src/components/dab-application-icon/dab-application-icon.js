/**
 * The application-icon web component module.
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
  #application-icon-wrapper {
    height: 45px;
    width: 45px;
    background-color: red;
    margin-right: 25px;
    cursor: pointer;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  #application-icon-wrapper:active {
      transform: scale(0.95)
  }

  #application-icon-wrapper:hover {
    box-shadow: 2px 5px 15px -10px rgba(255,255,255,0.75);
  }
  </style>

  <div id="application-icon-wrapper">
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-application-icon',
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
      
      // Selecting the application wrapper.
      this._applicationIconWrapper = this.shadowRoot.querySelector('#application-icon-wrapper')

      // The application icon name.
      this._name = ''
      
      // Binding this.
      this._createNewAppInstance = this._createNewAppInstance.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['name', 'src']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
        if(name === 'name') {
            this._name = newValue
        }

        if(name === 'src') {
            this._applicationIconWrapper.style.backgroundImage = `url(${newValue})`
        }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
        this._applicationIconWrapper.addEventListener('click', this._createNewAppInstance)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
        this._applicationIconWrapper.removeEventListener('click', this._createNewAppInstance)
    }

    _createNewAppInstance () {
        this.dispatchEvent(new window.CustomEvent('createNewAppInstance', {
            bubbles: true,
            composed: true,
            detail: {
              applicationName: this._name
            }
          }))
    }
  }
)