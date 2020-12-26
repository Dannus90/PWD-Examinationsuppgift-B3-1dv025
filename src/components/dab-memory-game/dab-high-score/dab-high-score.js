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
      max-width: 250px;
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
      font-size: 1.2rem;
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
      this._smallHighScore = []
      this._mediumHighScore = []
      this._largeHighScore = []

      this._highscoreContainer = this.shadowRoot.querySelector('.high-score-container')

      this._highscoreListContainer = this.shadowRoot.querySelector('.high-score-list-container')

      // Variables related to indexedDB
      this._dbName = 'MemoryGameDatabase'
      this._dbVersion = 1
      this._smallMemoryDbStore = 'SmallMemoryStore'
      this._mediumMemoryDbStore = 'MediumMemoryStore'
      this._largeMemoryDbStore = 'LargeMemoryStore'
      this._request = indexedDB.open(this._dbName , this._dbVersion)
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
      if (name === 'size') {
        switch (newValue) {
          case 'small': {
            this._request.onerror = (errorEvent) => {
              console.log('Got here')
              console.error(`A request error occured: ${errorEvent.target.error.message}`)
            }
            
            this._request.onsuccess = async (e) => {
              this._db = await e.target.result

              const smallMemoryStoreInstance = this._db.transaction(this._smallMemoryDbStore, 'readonly').objectStore(this._smallMemoryDbStore)
              mediumMemoryStoreInstance.getAll().onsuccess = async (e) => {
              const memoryData = await e.target.result
              console.log(memoryData)
            }
            }
      
            this._request.onupgradeneeded = async (e) => {
              console.log('Got here3')
              this._db = await e.target.result
              this._db.onerror = (errorEvent) => {
                console.error('Database error: ', errorEvent.target.error.message)
              }
            }
            break
          }
          case 'medium': {
            this._request.onerror = (errorEvent) => {
              console.log('Got here')
              console.error(`A request error occured: ${errorEvent.target.error.message}`)
            }
            
            this._request.onsuccess = async (e) => {
              this._db = await e.target.result

              const mediumMemoryStoreInstance = this._db.transaction(this._mediumMemoryDbStore, 'readonly').objectStore(this._mediumMemoryDbStore)
              mediumMemoryStoreInstance.getAll().onsuccess = async (e) => {
              const memoryData = await e.target.result
              console.log(memoryData)
            }
            }
      
            this._request.onupgradeneeded = async (e) => {
              console.log('Got here3')
              this._db = await e.target.result
              this._db.onerror = (errorEvent) => {
                console.error('Database error: ', errorEvent.target.error.message)
              }
            }
            break
          }
          case 'large': {
            this._request.onerror = (errorEvent) => {
              console.log('Got here')
              console.error(`A request error occured: ${errorEvent.target.error.message}`)
            }
            
            this._request.onsuccess = async (e) => {
              this._db = await e.target.result

              const largeMemoryStoreInstance = this._db.transaction(this._largeMemoryDbStore, 'readonly').objectStore(this._largeMemoryDbStore)
              largeMemoryStoreInstance.getAll().onsuccess = async (e) => {
              const memoryData = await e.target.result
              console.log(memoryData)
            }
            }
      
            this._request.onupgradeneeded = async (e) => {
              console.log('Got here3')
              this._db = await e.target.result
              this._db.onerror = (errorEvent) => {
                console.error('Database error: ', errorEvent.target.error.message)
              }
            }
            break
          }
        }
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }

    /**
     *
     */
    set smallHighScore (highscore) {
      this._smallHighScore = highscore
      console.log(this._smallHighScore)
    }

    /**
     *
     */
    set mediumHighScore (highscore) {
      this._mediumHighScore = highscore
      console.log(this._mediumHighScore)
    }

    /**
     *
     */
    set largeHighScore (highscore) {
      this._largeHighScore = highscore
      console.log(this._largeHighScore)
    }

    /**
     * Gets the high score of the component.
     *
     * @readonly
     * @returns {number[]} The current top scores.
     */
    get highScore () {
      return this._topScores
    }
  }
)
