/**
 * The flipping-tile web component module.
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
      cursor: pointer;
      overflow: hidden;
      display: block;
    }

    #flipping-tile-wrapper {
      background-color: transparent;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      border-radius: 10px;
      perspective: 1000px;
      padding: 0.3rem;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 130px;
      text-align: center;
      transition: transform 0.8s;
      transform-style: preserve-3d;
    }

    .card-front,
    .card-back {
      position: absolute;
      height: 100%;
      width: 100%;
      -webkit-backface-visibility: hidden; /* Safari */
      backface-visibility: hidden;
    }

    .front-side-image,
    .back-side-image {
      height: 75%;
      width: 75%;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
    }

    .card-front {
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 19%,
        rgba(237, 255, 8, 1) 72%
      );
      color: black;
      border-radius: 10px;
    }

    .card-back {
      background-color: dodgerblue;
      color: white;
      transform: rotateY(180deg);
      border-radius: 10px;
    }
  </style>

  <div id="flipping-tile-wrapper" part="flipping-tile-wrapper">
    <div part="card-inner" class="card-inner">
        <div part="card-front" class="card-front">
            <img part="front-image" class="front-side-image" src="/images/2.png" alt="Gramophone">
        </div>
        <div part="card-back" class="card-back">
            <img part="back-image" class="back-side-image" src="/images/lnu-symbol.png" alt="Questionmark">
        </div>
    </div>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-flipping-tile',
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

      /* Selecting the flipping tile wrapper. */
      this._cardContentContainer = this.shadowRoot.querySelector('#flipping-tile-wrapper')
      /* Get the p-element in which we display the information about which side is displayed */
      this._imageElement = this.shadowRoot.querySelector('.image-container')
      /* Used to toggle side information */
      this._frontSideDisplayed = true
      /* Front- and backside image element */
      this._frontSideImageElement = this.shadowRoot.querySelector('.front-side-image')
      this._backSideImageElement = this.shadowRoot.querySelector('.back-side-image')
      /* Inner card */
      this._cardInner = this.shadowRoot.querySelector('.card-inner')
    }

    /**
     * Watches the attributes backimage, frontimage, frontalt, backalt and borderstyle for changes on the element.
     *
     * @readonly
     * @static
     */
    static get observedAttributes () {
      return ['backimage', 'frontimage', 'frontalt', 'backalt', 'borderstyle']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the new attribute.
     * @param {any} oldValue of the attribute.
     * @param {any} newValue of the attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'backimage') {
        return this._backSideImageElement.setAttribute('src', newValue)
      }

      if (name === 'backalt') {
        return this._backSideImageElement.setAttribute('alt', newValue)
      }

      if (name === 'frontalt') {
        return this._frontSideImageElement.setAttribute('alt', newValue)
      }

      if (name === 'frontimage') {
        return this._frontSideImageElement.setAttribute('src', newValue)
      }

      if (name === 'borderstyle') {
        return this._cardContentContainer.style.border = newValue
      }
    }

    /**
     * Called after the element is inserted into the dom. Event listeners are added here.
     */
    connectedCallback () {
      this.addEventListener('click', this._flipCardAndDisplayCardSide)
      this.addEventListener('keypress', this._flipCardAndDisplayCardSide)
    }

    /**
     * Called when the element is disconnected from the dom.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._flipCardAndDisplayCardSide)
      this.removeEventListener('keypress', this._flipCardAndDisplayCardSide)
    }

    /**
     * This method will flip the card and display information regarding which side is currently displayed.
     */
    _flipCardAndDisplayCardSide () {
      if (this._frontSideDisplayed) {
        this._frontSideDisplayed = false
        this.dispatchEvent(new window.CustomEvent('flipped'))
        this._cardInner.style.transform = 'rotateY(180deg)'
        return
      }

      if (!this._frontSideDisplayed) {
        this._frontSideDisplayed = true
        this.dispatchEvent(new window.CustomEvent('flipped'))
        this._cardInner.style.transform = 'rotateY(0deg)'
      }
    }
  }
)
