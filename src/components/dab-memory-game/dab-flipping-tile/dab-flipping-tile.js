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
      --tile-height: 80px;
      --tile-width: 80px;
      height: var(--tile-height);
      width: var(--tile-width);
    }

    #flipping-tile-wrapper {
      background-color: transparent;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      border-radius: 10px;
      perspective: 1000px;
      height: var(--tile-height);
      width: var(--tile-width);
      word-break: break-all;
      line-height: 1.2rem;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
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
      overflow: hidden;
    }

    .front-side-image,
    .back-side-image {
      height: 100%;
      width: 100%;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
    }

    .card-front {
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 19%,
        rgb(81 122 255) 72%
      );
      color: black;
      border-radius: 10px;
      transform: rotateY(180deg);
    }

    .card-back {
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 19%,
        rgb(195 6 184) 72%
      );
      color: white;
      border-radius: 10px;
      transform: rotateY(0deg);
    }
  </style>

  <div id="flipping-tile-wrapper" part="flipping-tile-wrapper">
    <div part="card-inner" class="card-inner">
        <div part="card-front" class="card-front">
            <img part="front-image" class="front-side-image" src="" alt="memory-card-image">
        </div>
        <div part="card-back" class="card-back">
            <img part="back-image" class="back-side-image" src="" alt="Questionmark">
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

      // Variables.
      this._frontSideDisplayed = false

      // Selecting elements.
      this._cardContentContainer = this.shadowRoot.querySelector('#flipping-tile-wrapper')
      this._frontSideImageElement = this.shadowRoot.querySelector('.front-side-image')
      this._backSideImageElement = this.shadowRoot.querySelector('.back-side-image')
      this._cardInner = this.shadowRoot.querySelector('.card-inner')
    }

    /**
     * Watches the attributes backimage, frontimage, frontalt, backalt and borderstyle for changes on the element.
     *
     * @readonly
     * @static
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['backimage', 'frontimage', 'frontalt', 'backalt', 'borderstyle', 'disabled', 'hidden', 'face-up']
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
        this._backSideImageElement.setAttribute('src', newValue)
      }

      if (name === 'backalt') {
        this._backSideImageElement.setAttribute('alt', newValue)
      }

      if (name === 'frontalt') {
        this._frontSideImageElement.setAttribute('alt', newValue)
      }

      if (name === 'frontimage') {
        this._frontSideImageElement.setAttribute('src', newValue)
      }

      if (name === 'borderstyle') {
        this._cardContentContainer.style.border = newValue
      }

      if (name === 'disabled' || name === 'hidden') {
        // Determine if we should set or remove disabled attribute.
        const isToBeDisabled = Boolean(newValue) || newValue === ''

        if (isToBeDisabled) {
          this._cardContentContainer.setAttribute('disabled', '')
          this.blur()
        } else {
          this._cardContentContainer.removeAttribute('disabled', '')
        }
      }
    }

    /**
     * Called after the element is inserted into the dom. Event listeners are added here.
     */
    connectedCallback () {
      this.addEventListener('click', this._flipCardAndDisplayCardSide)
      this.addEventListener('keydown', this._flipCardAndDisplayCardSide)
    }

    /**
     * Called when the element is disconnected from the dom.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._flipCardAndDisplayCardSide)
      this.removeEventListener('keydown', this._flipCardAndDisplayCardSide)
    }

    /**
     * Specifies the equality between nodes.
     *
     * @param {Node} comparisonNode - The tile to test for equality.
     * @returns {boolean} - Returns true if the two compared nodes are equal.
     */
    isEqual (comparisonNode) {
      return this.isEqualNode(comparisonNode)
    }

    /**
     * This method will flip the card and display information regarding which side is currently displayed.
     *
     * @param {object} event The event object.
     */
    _flipCardAndDisplayCardSide (event) {
      // If the element nis hidden or disabled we end the class method directly.
      if (this.hasAttribute('disabled') ||
        this.hasAttribute('hidden')) {
        return
      }

      if (event.keyCode === 13 || event.type === 'click') {
      // Toggle the face-up attribute depending on previous state.
        this.hasAttribute('face-up')
          ? this.removeAttribute('face-up')
          : this.setAttribute('face-up', '')

        // Dispatch the tile flipped custom event.
        this.dispatchEvent(new CustomEvent('tileflipped', {
          bubbles: true,
          composed: true,
          detail: {
            faceUp: this.hasAttribute('face-up')
          }
        }))

        if (this._frontSideDisplayed) {
          this._frontSideDisplayed = false
          this._cardInner.style.transform = 'rotateY(0deg)'
          return
        }

        if (!this._frontSideDisplayed) {
          this._frontSideDisplayed = true
          this._cardInner.style.transform = 'rotateY(180deg)'
        }
      }
    }

    /**
     * Runs when two cards faced up does not match.
     */
    cardMissMatch () {
      this.removeAttribute('face-up')
      this._frontSideDisplayed = false
      this._cardInner.style.transform = 'rotateY(0deg)'
    }
  }
)
