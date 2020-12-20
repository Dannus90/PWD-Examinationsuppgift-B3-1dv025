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
      position: relative;
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

    #memory-game-wrapper p {
      text-align: center;
      margin: 0;
      margin-top: 0.5rem;
      font-size: 1.05rem;
    }

    .number-of-tries-display {
      color: #0d753a;
      font-weight: bold;
    }

    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }

    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${imageUrls[0]}") no-repeat center/80%, radial-gradient(#fff, #ffd700);;
    }

    .victory-modal {
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      position: absolute;
      width: 101%;
      height: 101%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      justify-content: center;
      align-items: center;
      flex-direction: column;
      display: none;
    }

    .victory-modal h3 {
      font-size: 3.5rem;
      color: #fff;
      margin: 1rem;
      margin-bottom: 0;
      line-height: 4rem;
      text-align: center;
    }

    .victory-modal p {
      margin: 0;
      font-size: 1.2rem;
      color: #fff;
      text-align: center;
    }

    .play-again-button {
      box-shadow: 0px 4px 5px -7px #276873;
      border-radius: 8px;
      display: inline-block;
      cursor: pointer;
      color: #fff;
      font-family: Arial;
      font-size: 1rem;
      font-weight: bold;
      padding: 10px 26px;
      text-decoration: none;
      margin: 1rem auto;
      outline: none;
      background: linear-gradient(to bottom, #22ff01 5%, #009310 100%);
      transition: transform 0.2s ease-in-out;
    }

    .play-again-button:focus,
    .try-again-button:active {
      transform: scale(1.05);
      box-shadow: 2px 5px 49px -30px rgba(255,255,255,1);
    }

    .play-again-button:hover {
      background: linear-gradient(to bottom, #009310 5%, #22ff01 100%);
    }
  </style>
  <template id="tile-template">
    <dab-flipping-tile></dab-flipping-tile>
  </template>
  <div id="memory-game-wrapper">
    <h2>Memory game</h2>
    <p>Number of tries: <span class="number-of-tries-display"></span></p>
    <div id="memory-game-board">
    </div>
    <div class="victory-modal">
      <h3>Victory!</h3>
      <p></p>
      <button class="play-again-button">Play again!</button>
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

      // Selecting the play again button.
      this._playAgainButton = this.shadowRoot.querySelector('.play-again-button')

      // Display number of tries.
      this._displayNumberOfTries = this.shadowRoot.querySelector('.number-of-tries-display')

      // Binding this to methods. 
      this._tileFlipped = this._tileFlipped.bind(this)

      this._resetGame = this._resetGame.bind(this)

      // The number of tries.
      this._numberOfTries = 0
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

      this._displayNumberOfTries.textContent = this._numberOfTries

      this._upgradeProperty('boardsize')

      this._memoryGameBoard.addEventListener('tileflipped', this._tileFlipped)
      this.addEventListener('dragstart', this._onDragStart)
      this.addEventListener('gameover', this._gameover)
      this._playAgainButton.addEventListener('click', this._resetGame)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._memoryGameBoard.removeEventListener('tileflipped', this._tileFlipped)
      this.removeEventListener('dragstart', this._onDragStart)
      this.removeEventListener('gameover', this._gameover)
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

      // Set the tiles images both for front and backside of the card.
      this._tiles.all.forEach((tile, i) => {
        
        tile.shadowRoot.querySelector('.front-side-image').setAttribute('src', imageUrls[indexes[i] % (amountOfTiles / 2) + 1])
        tile.shadowRoot.querySelector('.back-side-image').setAttribute('src', imageUrls[0])

        tile.faceUp = tile.disabled = tile.hidden = false

        // Making sure that the cards with the same image are matching. 
        tile.setAttribute('matchingid', JSON.stringify((indexes[i] % (amountOfTiles / 2) + 1)))
      })
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
        this._numberOfTries ++
        this._displayNumberOfTries.textContent = this._numberOfTries
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            first.style.visibility = 'hidden'
            second.style.visibility = 'hidden'
          } else {
            first.cardMissMatch()
            second.cardMissMatch()
            tilesToEnable.push(first, second)
          }

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

    _gameover () {
      this.shadowRoot.querySelector('.victory-modal').style.display = 'flex'
      this.shadowRoot.querySelector('.victory-modal').querySelector('p').textContent = `Victory! It took you ${this._numberOfTries} tries.`
    }

    _resetGame () {
      this.shadowRoot.querySelector('.victory-modal').style.display = 'none'
      this.shadowRoot.querySelector('.victory-modal').querySelector('p').textContent = ""
      this._numberOfTries = 0
      this._displayNumberOfTries.textContent = this._numberOfTries

      this._tiles.all.forEach((tile, i) => {
        tile.cardMissMatch()
      })

      this._tiles.all.forEach((tile, i) => {
        tile.style.visibility = 'visible'
        tile.removeAttribute('hidden')
        tile.removeAttribute('disabled')
      })
      this._initialize()
    }
  }
)
