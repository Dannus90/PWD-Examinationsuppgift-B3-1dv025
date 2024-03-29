/**
 * The memory-game web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

import './dab-flipping-tile/index.js'
import './dab-high-score/index.js'

const numberOfImages = 9

const imageUrls = new Array(numberOfImages)
for (let i = 0; i < numberOfImages; i++) {
  imageUrls[i] = (new URL(`assets/${i}.png`, import.meta.url)).href
}

const settingsIcon = (new URL('assets/settings-icon.svg', import.meta.url)).href

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
      background: radial-gradient(circle, rgb(151 151 178) 0%, rgba(106,97,176,1) 15%, rgba(80,72,140,1) 25%, rgba(2,0,36,1) 100%);
      position: relative;
      color: #fff;
    }

    .settings-icon {
      position: absolute;
      top: 25px;
      right: 14.5px;
      cursor: pointer;
      outline: none;
      transition: transform 0.2s ease-in;
    }

    .settings-icon:active {
      transform: scale(0.9);
    }

    settings-icon:focus-visible {
      outline: 2px solid #fff;
    }

    settings-icon:-moz-focusring {
      outline: 2px solid #fff;
    }

    .toggle-menu {
      background-image: linear-gradient( 110deg, var(--bg-color-primary) 0%, var(--bg-color-secondary) 50%, var(--bg-color-tertiary) 89% );
      padding: 0 0.5rem;
      position: absolute;
      top: 35px;
      right: -35px;
      width: 100px;
      border-radius: 5px;
      transform: scale(0.00);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.2s ease-in-out;
    }

    .pick-new-nickname-button {
      outline: none;
      cursor: pointer;
      padding: 0;
      background-color: transparent;
      color: #fff;
      font-weight: bold;
      border: none;
      transition: color 0.10s ease-in, transform 0.10s ease-in;
      font-size: 0.7rem;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0.3rem;
    }

    .pick-new-nickname-button:hover {
      color: #22ff01;
    }

    .high-score-component {
      position: absolute;
      top: 41.5%;
      right: -112%;
      transform: translate(-50%, -50%);
    }

    #memory-game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 15px;
      justify-content: center;
      align-items: center;
      padding: 1rem 1.5rem;
    }

    #memory-game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }

    #memory-game-wrapper h2 {
      text-align: center;
      margin: 0;
      font-size: 1.8rem;
      padding-top: 1rem;
      color: #b2b2b2b;
    }

    #memory-game-wrapper p {
      text-align: center;
      margin: 0;
      margin-top: 0.5rem;
      font-size: 1.05rem;
      line-height: 1.2rem;
    }

    .number-of-tries-display {
      color: #34e380;
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

    .gameSize-buttons-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1rem;
    }

    .size-button {
      padding: 0.3rem 0.6rem;
      margin: 0.4rem;
      border: none;
      border-radius: 5px;
      background-image: linear-gradient( 110deg, var(--bg-color-primary) 0%, var(--bg-color-secondary) 50%, var(--bg-color-tertiary) 89% );
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      outline: none;
      transition: transform 0.05s ease-in;
    }

    .size-button:hover {
      background-image: linear-gradient( 50deg, var(--bg-color-primary) 0%, var(--bg-color-secondary) 50%, var(--bg-color-tertiary) 89% );
      transform: scale(1.02);
      box-shadow: 2px 2px 16px -8px rgba(0,0,0,0.75);
    }

    .size-button:active {
      transform: scale(0.98);
    }

    .victory-modal p {
      line-height: 1.2rem;
      padding: 0.5rem;
    }

    .pickname-modal {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: rgba(0,0,0,0.85);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .pickname-input {
      padding: 0.5rem 0.75rem;
      outline: none;
      padding-left: 0.25rem;
    }

    .pickname-button {
      box-shadow: 0px 4px 5px -7px #276873;
      border-radius: 8px;
      display: inline-block;
      cursor: pointer;
      color: #fff;
      font-family: Arial;
      font-size: 1rem;
      font-weight: bold;
      padding: 8px 20px;
      border: none;
      text-decoration: none;
      margin: 1rem auto;
      outline: none;
      background: linear-gradient(to bottom, #22ff01 5%, #009310 100%);
      transition: transform 0.2s ease-in-out;
    }

    .pickname-button:focus {
      transform: scale(1.05);
      box-shadow: 2px 5px 49px -30px rgba(255,255,255,1);
    }

    .pickname-button:hover {
      background: linear-gradient(to bottom, #009310 5%, #22ff01 100%);
    }

    .pickname-button:focus-visible {
      outline: 2px solid #fff;
    }

    .pickname-button:-moz-focusring {
      outline: 2px solid #fff;
    }

    dab-flipping-tile {
      outline: none;
    }

    dab-flipping-tile:-moz-focusring {
      outline: 2px solid #fff; 
    }

    dab-flipping-tile:focus-visible {
      outline: 2px solid #fff;
    }

    .size-button:focus-visible {
      outline: 2px solid #fff;
    }

    .size-button:-moz-focusring {
      outline: 2px solid #fff;
    }

    .nickname-warning-paragraph {
      color: #ff1b1b;
      font-weight: bold;
      text-align: center;
      width: 80%;
      margin: 0;
      margin-top: 0.75rem;
      line-height: 1.2rem;
      display: none;
    }
  </style>
  <template id="tile-template">
    <dab-flipping-tile tabindex="0" style=></dab-flipping-tile>
  </template>
  <div id="memory-game-wrapper">
    <img tabindex="0" src="${settingsIcon}" class="settings-icon" height="17.5" width="17.5" />
    <div class="toggle-menu">
      <button class="pick-new-nickname-button">New nickname</button>
    </div> 
    <h2>Memory game</h2>
    <p>Number of tries: <span class="number-of-tries-display"></span></p>
    <p class="total-time-spent"></p>
    <div id="memory-game-board"></div>
    <div class="victory-modal">
      <h3>Victory!</h3>
      <p></p>
      <button class="play-again-button">Play again!</button>
    </div>
    <div class="pickname-modal">
      <input class="pickname-input" value="" />
      <p class="nickname-warning-paragraph">Please pick a nickname with atleast 3 characters.</p>
      <button class="pickname-button">Pick name</button>
    </div>
    <div class="gameSize-buttons-container">
      <button class="size-button" tabindex="0" value="small">2x2</button>
      <button class="size-button" tabindex="0" value="medium">4x2</button>
      <button class="size-button" tabindex="0" value="large">4x4</button>
    </div>
    <dab-high-score class="high-score-component"></dab-high-score>
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

      // Selecting the size buttons.
      this._sizeButtons = this.shadowRoot.querySelectorAll('.size-button')

      // Selecting the memory game wrapper.
      this._memoryGameWrapper = this.shadowRoot.querySelector('#memory-game-wrapper')

      // Selecting the high score component.
      this._highScoreComponent = this.shadowRoot.querySelector('.high-score-component')

      // Selecting the total time spent element.
      this._totalTimeSpentElement = this.shadowRoot.querySelector('.total-time-spent')

      // Display number of tries.
      this._displayNumberOfTries = this.shadowRoot.querySelector('.number-of-tries-display')

      // Selecting the pickname input.
      this._picknameInput = this.shadowRoot.querySelector('.pickname-input')

      // Selecting the pickname button.
      this._picknameButton = this.shadowRoot.querySelector('.pickname-button')

      // Selecting the toggle menu.
      this._toggleMenu = this.shadowRoot.querySelector('.toggle-menu')

      // Selecting the settings icon.
      this._settingsIcon = this.shadowRoot.querySelector('.settings-icon')

      // Selecting the pick new nickname button.
      this._pickNewNicknameButton = this.shadowRoot.querySelector('.pick-new-nickname-button')

      // Selecting the nickname warning paragraph.
      this._nicknameWarningParagraph = this.shadowRoot.querySelector('.nickname-warning-paragraph')

      // Toggle menu visible.
      this._toggleMenuVisible = false

      // The number of tries.
      this._numberOfTries = 0

      // TotalTime spent.
      this._totalTimeSpent = 0

      // The timing interval.
      this._interval = 'interval'

      // Set initial total time spent.
      this._totalTimeSpentElement.textContent = this._totalTimeSpent + ' sec'

      // Boolean regarding if the game has started or not.
      this._gameHasStarted = false

      // The game board size.
      this._currentGameBoardSize = 'large'

      // The person nickname
      this._nickname = 'Daniel'

      // Variables related to indexedDB
      this._dbName = 'PWDApplicationDatabase'
      this._dbVersion = 1
      this._recentMemoryNameDbStore = 'MemoryNicknameStore'
      this._request = indexedDB.open(this._dbName, this._dbVersion)
      this._db = ''

      // Binding this to methods.
      this._tileFlipped = this._tileFlipped.bind(this)
      this._resetGame = this._resetGame.bind(this)
      this._toggleSettingsMenu = this._toggleSettingsMenu.bind(this)
      this._openNickNameModal = this._openNickNameModal.bind(this)
      this._pickNewGameBoardSize = this._pickNewGameBoardSize.bind(this)
      this._pickName = this._pickName.bind(this)
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

    /**
     * Gets the current boardsize.
     *
     * @returns {string} A string regarding the current boardsize.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the boardsize.
     *
     * @param {string} size The new boardsize to be set.
     */
    set boardSize (size) {
      this.setAttribute('boardsize', size)
    }

    /**
     * Returns the boardsize depending on the boardsize attribute.
     *
     * @returns {object} Returns an object containing the current boardsize.
     */
    get _gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      if (this.boardSize === 'small') {
        gameBoardSize.width = gameBoardSize.height = 2
        return gameBoardSize
      }

      if (this.boardSize === 'medium') {
        gameBoardSize.height = 2
        return gameBoardSize
      }

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
      this._picknameButton.addEventListener(('click'), this._pickName)
      this._playAgainButton.addEventListener('click', this._resetGame)
      this._sizeButtons.forEach((sb) => sb.addEventListener('click', this._pickNewGameBoardSize))
      this._pickNewNicknameButton.addEventListener(('click'), this._openNickNameModal)
      this._settingsIcon.addEventListener(('click'), this._toggleSettingsMenu)

      /**
       * Runs upon request error and displays the error message.
       *
       * @param {object} errorEvent The event object.
       */
      this._request.onerror = (errorEvent) => {
        console.error(`A request error occured: ${errorEvent.target.error.message}`)
      }

      /**
       * Runs upon request success and initiates the database and sets the initial highscore.
       *
       * @param {object} e The even object.
       */
      this._request.onsuccess = async (e) => {
        this._db = await e.target.result

        const _recentMemoryNameDbStoreInstance = this._db.transaction(this._recentMemoryNameDbStore, 'readonly').objectStore(this._recentMemoryNameDbStore)
        /**
         * Gets all current data in the large memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        _recentMemoryNameDbStoreInstance.getAll().onsuccess = async (e) => {
          if (await e.target.result.length > 0) {
            const memoryData = await e.target.result
            this._picknameInput.value = memoryData[0].nickname
          }
        }
      }

      /**
       * Runs upon db upgrade to a new version and upgrades the database.
       *
       * @param {object} e The event object.
       */
      this._request.onupgradeneeded = async (e) => {
        this._db = await e.target.result
        /**
         * This runs upon indexedDB database error.
         *
         * @param {object} errorEvent The error event object.
         */
        this._db.onerror = (errorEvent) => {
          console.error('Database error: ', errorEvent.target.error.message)
        }
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._memoryGameBoard.removeEventListener('tileflipped', this._tileFlipped)
      this.removeEventListener('dragstart', this._onDragStart)
      this.removeEventListener('gameover', this._gameover)
      this._playAgainButton.removeEventListener('click', this._resetGame)
      this._picknameButton.removeEventListener(('click'), this._pickName)
      this._sizeButtons.forEach((sb) => sb.removeEventListener('click', this._pickNewGameBoardSize))
      this._pickNewNicknameButton.removeEventListener(('click'), this._openNickNameModal)
      this._settingsIcon.removeEventListener(('click'), this._toggleSettingsMenu)
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

    /**
     * This method initializes the memory game.
     */
    _initialize () {
      const { width, height } = this._gameBoardSize

      const amountOfTiles = width * height

      while (this._memoryGameBoard.firstChild) {
        this._memoryGameBoard.removeChild(this._memoryGameBoard.lastChild)
      }

      if (width === 2) {
        this._memoryGameBoard.classList.add('small')
      } else {
        this._memoryGameBoard.classList.remove('small')
      }

      // Adding tiles.
      for (let i = 0; i < amountOfTiles; i++) {
        const tile = this._tileTemplate.content.cloneNode(true)
        this._memoryGameBoard.appendChild(tile)
      }

      const indexes = [...Array(amountOfTiles).keys()]
      for (let i = indexes.length - 1; i > 0; i--) {
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

    /**
     * Gets all tiles from the memory boards children and converts them to an array, that is used to return an object.
     *
     * @returns {object} Returns an object Returns an object containing all tiles and tiles with specific attributes.
     */
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
     * @param {CustomEvent} event The custom event.
     */
    _tileFlipped (event) {
      // We start the game upon the first tile flip.
      if (!this._gameHasStarted) {
        this._gameHasStarted = !this._gameHasStarted
        this._runTimer()
      }
      const tiles = this._tiles

      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      // Destructuring.
      const [first, second, ...tilesToEnable] = tilesToDisable

      console.log(first, second)

      if (second) {
        this._numberOfTries++
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

    /**
     * We set the username to the input vale and the modal is removed.
     *
     * @param {object} event The event object.
     */
    _pickName (event) {
      event.preventDefault()
      if (!(this._picknameInput.value.length >= 3)) {
        this._showNicknameWarning()
        return
      }
      this._nickname = this._picknameInput.value
      this.shadowRoot.querySelector('.pickname-modal').style.display = 'none'
      this.dispatchEvent(new window.CustomEvent('pickedMemoryName', {
        bubbles: true,
        composed: true,
        detail: {
          pickedName: this._nickname,
          dbStore: this._recentMemoryNameDbStore
        }
      }))
    }

    /**
     * This method runs upon game victory and displays the amount of tries it took to finish the game.
     */
    _gameover () {
      clearInterval(this._interval)
      this.shadowRoot.querySelector('.victory-modal').style.display = 'flex'
      this.shadowRoot.querySelector('.victory-modal').querySelector('p').textContent = `Victory! It took you ${this._numberOfTries} tries and you finished in ${Math.round(this._totalTimeSpent * 100) / 100} sec`
      this.dispatchEvent(new window.CustomEvent('memoryGameOver', {
        bubbles: true,
        composed: true,
        detail: {
          numberOfTries: this._numberOfTries,
          totalTimeSpent: Math.round(this._totalTimeSpent * 100) / 100,
          boardsize: this.getAttribute('boardsize'),
          nickname: this._nickname
        }
      }))

      // When dispatched, this event updates the highscore.
      this.dispatchEvent(new window.CustomEvent('resetMemoryGame', {
        bubbles: true,
        composed: true,
        detail: {
          boardsize: this.getAttribute('boardsize'),
          currentHighscoreComponent: this._highScoreComponent
        }
      }))
    }

    /**
     * This method resets the game and happens when the modal button is clicked.
     */
    _resetGame () {
      clearInterval(this._interval)
      this.shadowRoot.querySelector('.victory-modal').style.display = 'none'
      this.shadowRoot.querySelector('.victory-modal').querySelector('p').textContent = ''

      // Resetting the number of tries, total time spent and game started status.
      this._numberOfTries = 0
      this._displayNumberOfTries.textContent = this._numberOfTries
      this._totalTimeSpent = 0
      this._totalTimeSpentElement.textContent = this._totalTimeSpent + ' sec'
      this._gameHasStarted = false

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

    /**
     * This method runs when a game size button is clicked and starts the game
     * with the chosen game size.
     *
     * @param {object} event The event object.
     */
    _pickNewGameBoardSize (event) {
      clearInterval(this._interval)
      this.setAttribute('boardsize', event.target.value)
      // Resetting the number of tries, total time spent and game started status.
      this._numberOfTries = 0
      this._displayNumberOfTries.textContent = this._numberOfTries
      this._totalTimeSpent = 0
      this._totalTimeSpentElement.textContent = this._totalTimeSpent + ' sec'
      this._gameHasStarted = false

      // Styling the board depending on game size.
      if (event.target.value === 'small') {
        this._highScoreComponent.style.top = '62.5%'
        this._highScoreComponent.style.right = '-161%'
        this._memoryGameWrapper.style.paddingLeft = '2rem'
        this._memoryGameWrapper.style.paddingRight = '2rem'
      } else if (event.target.value === 'medium') {
        this._highScoreComponent.style.top = '62.5%'
        this._highScoreComponent.style.right = '-112%'
        this._memoryGameWrapper.style.padding = '0'
      } else {
        this._highScoreComponent.style.top = '41.5%'
        this._highScoreComponent.style.right = '-112%'
        this._memoryGameWrapper.style.padding = '0'
      }

      this.dispatchEvent(new window.CustomEvent('updateHighscore', {
        bubbles: true,
        composed: true,
        detail: {
          highscoreToBeDisplayed: event.target.value,
          currentHighscoreComponent: this._highScoreComponent
        }
      }))

      this._initialize()
    }

    /**
     * Runs the timer or calls the runOutOfTime method and displays "Time ran out!".
     */
    _runTimer () {
      clearInterval(this._interval)
      this._interval = setInterval(() => {
        this._totalTimeSpent += 0.10
        this._totalTimeSpentElement.textContent = Math.round(this._totalTimeSpent * 100) / 100 + ' sec'
      }, 100)
    }

    /**
     * This method toggles the settings menu.
     */
    _toggleSettingsMenu () {
      if (this._toggleMenuVisible) {
        this._toggleMenuVisible = !this._toggleMenuVisible
        this._toggleMenu.style.transform = 'scale(0.00)'
      } else {
        this._toggleMenuVisible = !this._toggleMenuVisible
        this._toggleMenu.style.transform = 'scale(1)'
      }
    }

    /**
     * This method opens the nickname modal which allows us to pick a new nickname.
     */
    _openNickNameModal () {
      this.shadowRoot.querySelector('.pickname-modal').style.display = 'flex'
      this._toggleMenuVisible = !this._toggleMenuVisible
      this._toggleMenu.style.transform = 'scale(0.00)'
    }

    /**
     * This method shows a warning incase the chosen nickname is to short.
     */
    _showNicknameWarning () {
      this._nicknameWarningParagraph.style.display = 'block'
      setTimeout(() => {
        this._nicknameWarningParagraph.style.display = 'none'
      }, 1500)
    }
  }
)
