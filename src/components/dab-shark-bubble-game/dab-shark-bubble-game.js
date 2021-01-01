/**
 * The pwd-application web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

const shootingSound = (new URL('sound/shooting.mp3', import.meta.url)).href
const missedSound = (new URL('sound/missed.mp3', import.meta.url)).href
const backgroundMusic = (new URL('sound/game-background.mp3', import.meta.url)).href
const backgroundImage = (new URL('assets/background.jpg', import.meta.url)).href
const sharkImage1 = (new URL('assets/shark-1.png', import.meta.url)).href
const sharkImage2 = (new URL('assets/shark-2.png', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #bubble-shark-game-wrapper {
        width: 1000px;
        height: 500px;
    }

    .game-area {
        position: relative;
        overflow: hidden;
        background: url("${backgroundImage}");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
    }

    #shooting-audio,
    #lost-audio,
    #game-background {
        display: none;
    }

    /* Shark style*/
    .shark-1 {
        background: url("${sharkImage1}");
        position: absolute;
        left: -300px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 3rem;
        width: 3rem;
    }

    .shark-2 {
        background: url("${sharkImage2}");
        position: absolute;
        left: -300px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 5rem;
        width: 7rem;
    }

    .ball {
        -webkit-border-radius: 50%;
        border-radius: 50%;
        -webkit-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        height: 50px;
        position: absolute;
        width: 50px;
        top: -100px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: hotpink;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
    }
    
    .ball:after {
        background: -moz-radial-gradient(
            center,
            ellipse cover,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        background: -webkit-gradient(
            radial,
            center center,
            0px,
            center center,
            100%,
            color-stop(0%, rgba(255, 255, 255, 0.5)),
            color-stop(70%, rgba(255, 255, 255, 0))
        );
        background: -webkit-radial-gradient(
            center,
            ellipse cover,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        background: -o-radial-gradient(
            center,
            ellipse cover,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        background: -ms-radial-gradient(
            center,
            ellipse cover,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 70%
        );
        background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0) 40%
        );
        border-radius: 50%;
        -webkit-box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
        content: "";
        height: 50px;
        left: 0;
        position: absolute;
        width: 50px;
    }

    .start-game-modal {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.75);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .start-game-button {
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

    .start-game-button:focus {
        transform: scale(1.05);
        box-shadow: 2px 5px 49px -30px rgba(255,255,255,1);
      }

    .start-game-button:hover {
    background: linear-gradient(to bottom, #009310 5%, #22ff01 100%);
    }

    .start-game-button:focus-visible {
    outline: 2px solid #fff;
    }

    .start-game-button:-moz-focusring {
    outline: 2px solid #fff;
    }

    .score-container {
        text-align: center;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 3px;
        position: absolute;
        top: 40px;
        z-index: 1;
        font-weight: bold;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
      }
      
      .score-wrap {
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        width: 200px;
        padding: 8px 0;
        border-radius: 10px;
        display: inline-flex;
        flex-direction: column;
      }
      
      .score-wrap p {
        margin: 0;
        padding: 0;
        justify-content: center;
        align-items: center;
        line-height: 1rem;
        font-family: "DM Sans"
      }
      
      .score-wrap p:last-child {
        text-align: center;
      }
      
      .missed-score,
      .hit-by-shark,
      .total-fails {
        color: red;
      }
      
      .score {
        color: chartreuse;
      }
  </style>

  <div id="bubble-shark-game-wrapper">
    <div id="container" class="game-area">
    <div class="score-container">
        <div class="score-wrap">
            <p>Score: <span id="score" class="score">0</span></p>
            <p>
                Missed:
                <span id="missed-score" class="missed-score">0</span>
            </p>
            <p>
                Hit By Shark:
                <span id="hit-by-shark" class="hit-by-shark">0</span>
            </p>
            <p>
                Total Fails:
                <span id="total-fails" class="total-fails">0</span>
            </p>
        </div>
    </div>
        <div id="start-game-modal" class="start-game-modal">
            <button id="start-game-button" class="start-game-button">Start game</button>
        </div>
    </div>

    <audio id="shooting-audio" controls>
        <source src="${shootingSound}" type="audio/mp3" />
    </audio>
    <audio id="lost-audio" controls>
        <source src="${missedSound}" type="audio/mp3" />
    </audio>
    <audio id="game-background" loop controls>
        <source src="${backgroundMusic}" type="audio/mp3" />
    </audio>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-shark-bubble-game',
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

      // Selecting game elements.
      this._gameContainer = this.shadowRoot.querySelector('#container')
      this._startButton = this.shadowRoot.querySelector('#start-game-button')
      this._startGameModal = this.shadowRoot.querySelector('#start-game-modal')
      this._bubbleSharkGameWrapper = this.shadowRoot.querySelector('#bubble-shark-game-wrapper')

      // Selecting the audio elements.
      this._shootingAudio = this.shadowRoot.querySelector('#shooting-audio')
      this._missedAudio = this.shadowRoot.querySelector('#lost-audio')
      this._backgroundMusic = this.shadowRoot.querySelector('#game-background')

      // Game variables.
      this._sharkCount = 3
      this._sharkSpeed = 10
      this._score = 0
      this._missedCount = 0
      this._hitBySharkCount = 0
      this._totalFailsCount = 0
      this._ballCount = 3
      this._dropBallSpeed = 10
      this._gameOver = false
      this._gameContainerHeight = this._bubbleSharkGameWrapper.clientHeight;
      this._gameContainerWidth = this._bubbleSharkGameWrapper.clientWidth;

      // Binding this
      this._startGame = this._startGame.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['', '']
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
        this._startButton.addEventListener('click', this._startGame)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     *
     */
    _startGame () {
      this._startGameModal.style.display = 'none'
      this._backgroundMusic.load()
      this._backgroundMusic.play()

      // Looping shark and increase difficulty gradually
      let loopTimingShark = 3250

      /**
       *
       */
      const loopShark = () => {
        if (this._totalFailsCount < 15) {
          for (let i = 0; i < this._sharkCount; i++) {
            if (this._totalFailsCount < 15) {
              const clientHeight = this._bubbleSharkGameWrapper.clientHeight
              const clientWidth = this._bubbleSharkGameWrapper.clientWidth  
              const sharkEl = this._createShark()
              const topPos = this._getRandomNo(
                clientHeight - 103
              )
              const endPos = clientWidth

              const intervalTimeShark = this._getRandomNo(100) + i * 1000

              const intervalShark = setInterval(() => {
                this._moveShark(
                  sharkEl,
                  topPos,
                  endPos,
                  this._sharkSpeed
                )
                clearInterval(intervalShark)
              }, intervalTimeShark)
            } else {
              return
            }
          }
          if (loopTimingShark > 1000) {
            loopTimingShark -= 20
          }

          if (this._sharkSpeed > 0.3) {
            this._sharkSpeed -= 0.1
          }

          window.setTimeout(loopShark, loopTimingShark)
        } else {
            return
        }
      }

      // The amount of ms before next ball drop round happens.
      // Increases gradually in the game.
      let loopTimingBall = 3250

      /**
       *
       */
      const loopBall = () => {
        if (this._totalFailsCount < 15) {
          for (let i = 0; i < this._ballCount; i++) {
            if (this._totalFailsCount < 15) {
              const clientHeight = this._bubbleSharkGameWrapper.clientHeight
              const clientWidth = this._bubbleSharkGameWrapper.clientWidth   
              const ballEl = this._createBall()
              const leftPos = this._getRandomNo(
                clientWidth - 103
              )

              // The endposition where the ball touches the bottom and totalFailsCount increases.
              const endPos = clientHeight - 50
              const intervalTimeBall = this._getRandomNo(100) + i * 1000

              const intervalBall = setInterval(() => {
                this._dropBall(
                  ballEl,
                  leftPos,
                  endPos,
                  this._dropBallSpeed
                )

                clearInterval(intervalBall)
              }, intervalTimeBall)
            } else {
              return
            }
          }
          if (loopTimingBall > 1000) {
            loopTimingBall -= 20
          }

          if (this._dropBallSpeed > 0.3) {
            this._dropBallSpeed -= 0.1
          }

          window.setTimeout(loopBall, loopTimingBall)
        } else {
          this._gameEnded()
        }
      }

      loopBall()
      loopShark()
    }

    /**
     * Created a shark element and appends it to the game container.
     * 
     * @returns {HTMLDivElement} A div with a shark image.
     */
    _createShark () {
      const sharkEl = document.createElement('div')

      sharkEl.classList.add(`shark-${Math.floor(Math.random() * 2) + 1}`)
        
      // If the mouse is over the shark the _removeShark method runs.
      sharkEl.addEventListener('mouseover', (event) =>
        this._removeShark(event)
      )

      this._gameContainer.appendChild(sharkEl)

      return sharkEl
    }

    //Checking if game over
    _gameEnded() {
        this._gameContainer.innerHTML = `<div class="background">
        <div class="modal">
            <p class="lost-game-text">
                You lost the game! Please try again!
            </p>
            <p class="final-score">
                Final score: <span class="score">${this.score}</span>
            </p>
        </div>
    </div>`;
        this.startBtnEl.addEventListener("click", () =>
            this.gameEndedRemover()
        );

        // this.shootingAudio.pause();
        // this.missedAudio.pause();
        this._backgroundMusic.pause();
    }

    /**
     * This method resets the game.
     */
    _gameEndedRemover() {
        this._startBtnEl.remove();
        this._missedCount = 0;
        this._hitBySharkCount = 0;
        this._totalFailsCount = 0;
        this._sharkSpeed = 10;
        this._dropBallSpeed = 10;
        this._score = 0;
        this._loopTimingShark = 3250;
        this._loopTimingBall = 3250;
        this._hitBySharkEl.textContent = this.hitBySharkCount.toString();
        this._totalFailsEl.textContent = this.totalFailsCount.toString();
        this._missedScoreEl.textContent = this.missedCount.toString();
        this._scoreEl.textContent = this.score.toString();

        this._startGame();
    }

    /**
     * @param {object} event The event object.
     */
    _removeShark (event) {
      const targetSharkEl = event.target
      this.hitBySharkCount += 1
      this.totalFailsCount += 1

      this._missedAudio.play()
      targetSharkEl.remove()
    }

    // Move Shark
    /**
     * @param sharkEl
     * @param topPos
     * @param endPos
     * @param speed
     */
    _moveShark (sharkEl, topPos, endPos, speed) {
      let currentLeft = 0

      sharkEl.style.top = topPos + 'px'

      const interval = setInterval(() => {
        if (endPos === currentLeft) {
          clearInterval(interval)
          sharkEl.remove()
        } else {
          currentLeft += 2
          sharkEl.style.left = currentLeft + 'px'
        }
      }, speed)
    }

    // Ball Events
    /**
     *
     */
    _createBall () {
      const ballEl = document.createElement('div')

      const points = this._getRandomNo(99)

      ballEl.classList.add('ball')

      ballEl.textContent = points.toString()

      // SET AND GET ATTRIBUTE TO GRAB POINTS
      ballEl.setAttribute('data-points', points)

      ballEl.addEventListener('click', (event) => this._shotBall(event))

      this._gameContainer.appendChild(ballEl)

      return ballEl
    }

    /**
     * @param ballEl
     * @param leftPos
     * @param endPos
     * @param speed
     */
    _dropBall (ballEl, leftPos, endPos, speed) {
      let currentTop = 0

      ballEl.style.left = leftPos + 'px'
      ballEl.style.backgroundColor = '#' + this._getRandomNoForBall(899)

      // Doing like this to clear the intervall
      const interval = setInterval(() => {
        if (endPos <= currentTop) {
          clearInterval(interval)
          this._missedAudio.play()
          ballEl.remove()
          this._missedCount += 1
          this._totalFailsCount += 1
        } else {
          currentTop += 2
          ballEl.style.top = currentTop + 'px'
        }
      }, speed)
      // Binding the inteval to this particular ball
      ballEl.setAttribute('data-interval-id', interval)
    }

    /**
     * @param event
     */
    _shotBall (event) {
      const targetEl = event.target
      const points = targetEl.getAttribute('data-points')
      const intervalId = parseInt(targetEl.getAttribute('data-interval-id'))

      clearInterval(intervalId)
      this._addScore(points)
      this._shootingAudio.play()
      targetEl.remove()
    }

    /**
     * @param points
     */
    _addScore (points) {
      this.score += parseInt(points)
    }

    /**
     * @param range
     */
    _getRandomNo (range) {
      return Math.floor(Math.random() * range) + 1
    }

    /**
     * @param range
     */
    _getRandomNoForBall (range) {
        return Math.floor(Math.random() * range) + 100
      }
  }
)
