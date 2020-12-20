/**
 * The memory-game web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

import './dab-flipping-tile/index.js'
const numberOfImages = 9

const imageUrls = new Array(numberOfImages)
for (let i = 0; i < numberOfImages; i++) {
  imageUrls[i] = (new URL(`assets/${i}.png`, import.meta.url)).href
}

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      --tile-size: 80px;
    }

    #memory-game-wrapper {
      background-color: #fff;
    }

    #memory-game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 15px;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
    }

    #memory-game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }

    #memory-game-wrapper h2 {
      text-align: center;
      margin: 0;
      font-size: 1.8rem;
      padding-top: 1.5rem;
      color: #b2b2b2b;
    }

    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }

    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${imageUrls[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }
  </style>
  <template id="tile-template">
    <dab-flipping-tile></dab-flipping-tile>
  </template>
  <div id="memory-game-wrapper">
    <h2>Memory game</h2>
    <div id="memory-game-board">
    </div>
  </div>

`

/**
 * Define custom element.
 */
customElements.define('dab-memory-game',
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

      // Selecting the game board.
      this._memoryGameBoard = this.shadowRoot.querySelector('#memory-game-board')

      // Selecting the tile template. 
      this._tileTemplate = this.shadowRoot.querySelector('#tile-template')

      // Binding this to the method 
      this._tileFlipped = this._tileFlipped.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this._initialize()
      }
    }

    get boardSize () {
      return this.getAttribute('boardsize')
    }

    set boardSize (size) {
      this.setAttribute('boardsize', size)
    }

    get _gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      if(this.boardSize === 'small') return gameBoardSize.width = gameBoardSize.height = 2
      if(this.boardSize === 'medium') return gameBoardSize.height = 2

      return gameBoardSize
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this._upgradeProperty('boardsize')

      this._memoryGameBoard.addEventListener('tileflipped', this._tileFlipped)
      this.addEventListener('dragstart', this._onDragStart)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._memoryGameBoard.removeEventListener('tileflipped', this._tileFlipped)
      this.removeEventListener('dragstart', this._onDragStart)
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    _initialize () {
      const { width, height } = this._gameBoardSize

      const amountOfTiles = width * height

      if (amountOfTiles !== this._tiles.all.length) {
        while(this._memoryGameBoard.firstChild) {
          this._memoryGameBoard.removeChild(this._memoryGameBoard.lastChild)
        }

        if(width === 2) {
          this._memoryGameBoard.classList.add('small')
        } else {
          this._memoryGameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < amountOfTiles; i++) {
          const tile = this._tileTemplate.content.cloneNode(true)
          this._memoryGameBoard.appendChild(tile)
        }

        const indexes = [...Array(amountOfTiles).keys()]
        for(let i = indexes.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
        }

        console.log(indexes)

        // Set the tiles images both for front and backside of the card.
        this._tiles.all.forEach((tile, i) => {          
          tile.shadowRoot.querySelector('.front-side-image').setAttribute('src', imageUrls[indexes[i] % (amountOfTiles / 2) + 1])
          tile.shadowRoot.querySelector('.back-side-image').setAttribute('src', imageUrls[0])
          tile.faceUp = tile.disabled = tile.hidden = false

          // Making sure that the cards with the same image are matching. 
          tile.setAttribute('matchingid', JSON.stringify((indexes[i] % (amountOfTiles / 2) + 1)))
        })
      }
    }

    /**
     * Handles drag start events. This is needed to prevent the
     * dragging of tiles.
     *
     * @param {DragEvent} event - The drag event.
     */
    _onDragStart (event) {
      // Disable element dragging.
      event.preventDefault()
      event.stopPropagation()
    }


    get _tiles () {
      const tiles = Array.from(this._memoryGameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter((tile) => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter((tile) => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter((tile) => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Handles flip events.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _tileFlipped (event) {
      const tiles = this._tiles
      
      const tilesToDisable = Array.from(tiles.faceUp)


      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)
        console.log(isEqual)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          let eventName = 'tilesmismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'tilesmatch'
          } else {
            first.cardMissMatch()
            second.cardMissMatch()
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('gameover', {
              bubbles: true
            }))

            this._initialize()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

  }
)
