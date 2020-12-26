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
            // TODO LOGIC FOR HIGH SCORE
            break
          }
          case 'medium': {
            // TODO LOGIC FOR HIGH SCORE
            break
          }
          case 'large': {
            // TODO LOGIC FOR HIGH SCORE
          }
        }
      }
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
