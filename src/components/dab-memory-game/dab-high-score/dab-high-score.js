/**
 * The high-score web component module.
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
    .high-score-container {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,0.50);
      border-radius: 5px;
      width: 260px;
    }

    .high-score-container h2 {
      text-align: center;
      font-size: 1.2rem;
      margin-bottom: 0rem;
      color: #ffc65c;
    }

    .high-score-container ul {
      margin-top: 0.3rem;
      padding-inline-start: 0;
    }

    .high-score-container ul li {
      list-style: none;
      font-size: 1rem;
      color: #fff;
    }

    @media only screen and (max-width: 1225px) {
      .high-score-container ul li {
        font-size: 1rem;
      }
    }

    @media only screen and (max-width: 450px) {
      .high-score-container {
        text-align: center;
      }
    }
  </style>
  <div class="high-score-container">
    <h2 class="high-score-heading">High Score - Top 3</h2>
    <ul class='high-score-list-container'>
    </ul>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-high-score',
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

      // Selecting the highscore heading.
      this._highscoreHeading = this.shadowRoot.querySelector('.high-score-heading')

      // Storing all the scores.
      this._highscore = []

      this._highscoreContainer = this.shadowRoot.querySelector('.high-score-container')

      this._highscoreListContainer = this.shadowRoot.querySelector('.high-score-list-container')

      // Variables related to indexedDB
      this._dbName = 'MemoryGameDatabase'
      this._dbVersion = 1
      this._smallMemoryDbStore = 'SmallMemoryStore'
      this._mediumMemoryDbStore = 'MediumMemoryStore'
      this._largeMemoryDbStore = 'LargeMemoryStore'
      this._request = indexedDB.open(this._dbName, this._dbVersion)
      this._db = ''
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['size']
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

        const largeMemoryStoreInstance = this._db.transaction(this._largeMemoryDbStore, 'readonly').objectStore(this._largeMemoryDbStore)
        /**
         * Gets all current data in the large memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        largeMemoryStoreInstance.getAll().onsuccess = async (e) => {
          const memoryData = await e.target.result
          this._displayHighScore(memoryData)
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

    }

    /**
     * Displays the current high score for the current game board size.
     *
     * @param {Array} highscore An array containing the high score to be displayed.
     */
    _displayHighScore (highscore) {
      this._highscoreListContainer.textContent = ''
      this._highscore = highscore

      const highscoreCopy = [...this._highscore]

      highscoreCopy.sort((a, b) => {
        if (a.numberOfTries === b.numberOfTries) {
          return a.time - b.time
        }
        return a.numberOfTries - b.numberOfTries
      })
      const topscores = highscoreCopy.splice(0, 3)
      const numberOfEmptyScores = 3 - this._highscore.length

      topscores.forEach((score, i) => {
        const li = document.createElement('li')
        li.textContent = `${i + 1}: ${score.nickname} (${score.numberOfTries}) - ${score.time}s`
        this._highscoreListContainer.appendChild(li)
      })

      if (numberOfEmptyScores > 0) {
        for (let i = 0; i < numberOfEmptyScores; i++) {
          const li = document.createElement('li')
          li.innerHTML = `${i + this._highscore.length + 1}: Empty`
          this._highscoreListContainer.appendChild(li)
        }
      }
    }

    /**
     * This method updates the currently shown highscore.
     *
     * @param {string} highscoreToBeDisplayed A string regarding which highscore that should be displayed.
     */
    updateHighscore (highscoreToBeDisplayed) {
      if (highscoreToBeDisplayed === 'small') {
        const smallMemoryStoreInstance = this._db.transaction(this._smallMemoryDbStore, 'readonly').objectStore(this._smallMemoryDbStore)
        /**
         * Gets all current data in the small memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        smallMemoryStoreInstance.getAll().onsuccess = async (e) => {
          const memoryData = await e.target.result
          this._displayHighScore(memoryData)
        }
      } else if (highscoreToBeDisplayed === 'medium') {
        const mediumMemoryStoreInstance = this._db.transaction(this._mediumMemoryDbStore, 'readonly').objectStore(this._mediumMemoryDbStore)
        /**
         * Gets all current data in the medium memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        mediumMemoryStoreInstance.getAll().onsuccess = async (e) => {
          const memoryData = await e.target.result
          this._displayHighScore(memoryData)
        }
      } else {
        const largeMemoryStoreInstance = this._db.transaction(this._largeMemoryDbStore, 'readonly').objectStore(this._largeMemoryDbStore)
        /**
         * Gets all current data in the large memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        largeMemoryStoreInstance.getAll().onsuccess = async (e) => {
          const memoryData = await e.target.result
          this._displayHighScore(memoryData)
        }
      }
    }
  }
)
