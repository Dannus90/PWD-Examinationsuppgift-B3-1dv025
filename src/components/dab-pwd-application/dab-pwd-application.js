/**
 * The pwd-application web component module.
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
    :host {
        --bg-color-primary: rgb(0, 19, 98);
        --bg-color-secondary: rgb(40, 158, 198);
        --bg-color-tertiary: rgb(0, 19, 98);
    }

    #pwd-application-wrapper {
        height: 100vh;
        width: 100vw;
        background-color: #fff;
        overflow: hidden;
    }

    .pwd-application-topbar {
        background-image: linear-gradient(
            110deg,
            var(--bg-color-primary) 0%,
            var(--bg-color-secondary) 50%,
            var(--bg-color-tertiary) 89%
          );
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .pwd-application-topbar .pwd-application-heading {
        color: #fff;
        font-size: 2rem;
        background: -webkit-linear-gradient(45deg, #ffeaea, #fdfdfd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        line-height: 2.5rem;
        padding: 0.15rem;
        margin: 1rem;
    }

    .pwd-application-applications-container {
        height: 100%;
        width: 100%;
        background-image: url("./assets/default-background.jpeg");
        box-shadow:inset 0 0 0 2000px rgba(0, 0, 0, 0.5);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    @media only screen and (max-width: 1150px) {
        .pwd-application-topbar .pwd-application-heading {
            font-size: 1.9rem;
        }
    }

    @media only screen and (max-width: 800px) {
        .pwd-application-topbar .pwd-application-heading {
            font-size: 1.8rem;
        }
    }

    @media only screen and (max-width: 500px) {
        .pwd-application-topbar .pwd-application-heading {
            font-size: 1.6rem;
            line-height: 2.2rem;
        }
    }

    @media only screen and (max-width: 400px) {
        .pwd-application-topbar .pwd-application-heading {
            font-size: 1.4em;
            line-height: 2rem;
        }
    }
  </style>

  <div id="pwd-application-wrapper">
    <div class="pwd-application-topbar">
        <h1 class="pwd-application-heading"></h1>
    </div>
    <div class="pwd-application-applications-container"></div>
    <div class="pwd-application-icons-container"><div>    
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-pwd-application',
  /**
   * Class extending HTMLElement.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /* Attach a shadow DOM tree to this element and
      append the template to the shadow root. */
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Selecting the main application heading.
      this._applicationHeader = this.shadowRoot.querySelector('.pwd-application-heading')
      
      // The application standard name.
      this._applicationHeaderText = 'Personal Web Desktop'
      
      // The application applications container
      this._applicationsContainer = this.shadowRoot.querySelector('.pwd-application-applications-container')
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
            this._applicationHeaderText = newValue
        }
        if(name === 'src') {
            this._applicationsContainer.style.backgroundImage = `url(${newValue})`
        }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
        this._applicationHeader.textContent = this._applicationHeaderText
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)