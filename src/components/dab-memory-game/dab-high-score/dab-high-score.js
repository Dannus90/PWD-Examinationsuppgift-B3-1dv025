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
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,0.50);
      border-radius: 5px;
    }

    .high-score-container h2 {
      text-align: center;
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
    <h2>High Score - Top 5</h2>
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

      this._topScores = []

      this._highscoreContainer = this.shadowRoot.querySelector('.high-score-container')

      this._highscoreListContainer = this.shadowRoot.querySelector('.high-score-list-container')
    }

    /**
     * Sets the high score of the component.
     *
     * @param {Array} highscore An array of the current highscores stored in indexedDB.
     */
    set highScore (highscore) {
      this._highscoreListContainer.textContent = ''
      const topScores = highscore.sort((a, b) => a.score - b.score).slice(0, 5)
      const numberOfEmptyScores = 5 - topScores.length
      this._topScores = topScores

      this._topScores.forEach((topScore, i) => {
        const li = document.createElement('li')
        li.textContent = `${i + 1}: ${topScore.nickname} (${topScore.score}s) - ${topScore.date}`
        this._highscoreListContainer.appendChild(li)
      })

      if (numberOfEmptyScores > 0) {
        for (let i = 0; i < numberOfEmptyScores; i++) {
          const li = document.createElement('li')
          li.innerHTML = `${i + this._topScores.length + 1}: Empty`
          this._highscoreListContainer.appendChild(li)
        }
      }
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