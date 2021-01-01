/**
 * The pwd-application web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

const shootingSound = (new URL('sound/popBall.mp3', import.meta.url)).href
const missedSound = (new URL('sound/missed.mp3', import.meta.url)).href
const backgroundMusic = (new URL('sound/game-background.mp3', import.meta.url)).href
const backgroundImage = (new URL('assets/background.jpg', import.meta.url)).href
const sharkImage1 = (new URL('assets/shark-1.png', import.meta.url)).href
const sharkImage2 = (new URL('assets/shark-2.png', import.meta.url)).href
const playerOneImage = (new URL('assets/johan.jpg', import.meta.url)).href
const playerTwoImage = (new URL('assets/mats.jpeg', import.meta.url)).href

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

      .player-pick-container {
          display: flex;
          flex-direction: column;
      }

      .player-images-container {
          display: flex;
      }

      .player-pick-container h3 {
          color: #fff;
          text-align: center;
          font-weight: bold;
      }

      .player-one-container,
      .player-two-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      .player-one-container {
          margin-right: 2rem;
      }

      .player-two-container {
          margin-left: 2rem;
      }

      .player-one-container p,
      .player-two-container p {
          color: #fff;
          padding: 0;
          margin: 0;
          text-align: center;
          font-size: 0.8rem;
      }

    .playerImageOne,
    .playerImageTwo {
        width: 150px;
        height: 150px;
        perspective: 1000px;
        transition: all 1s;
        margin-bottom: 3rem;
    }

    .playerImageOne a,
    .playerImageTwo a {
        display: block;
        width: 150px;
        height: 150px;
        transform-style: preserve-3d;
        transition: all 0.5s ease-in-out;
        transform: rotateX(20deg);
        border-radius: 10px 10px 0px 0px;
    }

    .playerImageOne a {
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
            url("${playerOneImage}");
            background-size: 0, cover;
    }

    .playerImageTwo a {
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
            url("${playerTwoImage}");
            background-size: 0, cover;
    }

    .playerImageOne:hover a,
    .playerImageTwo:hover a {
        transform: rotateX(0deg);
        transform-origin: bottom;
    }

    .playerImageOne:hover a:after,
    .playerImageTwo:hover a:after {
        transform: rotateX(180deg);
    }

    .playerImageOne:hover a span,
    .playerImageTwo:hover a span {
        transform: rotateX(15.99deg);
    }

    .playerImageOne a:after,
    .playerImageTwo a:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 36px;
        background: inherit;
        background-size: cover, cover;
        background-position: bottom;
        transform: rotateX(120deg);
        transform-origin: bottom;
    }

    .playerImageOne a span,
    .playerImageTwo a span {
        color: white;
        text-transform: uppercase;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        font: bold 12px/36px "Open Sans";
        text-align: center;
        transform: rotateX(-55.99deg);
        transform-origin: top;
        z-index: 1;
    }

    .playerImageOne a:before,
    .playerImageTwo a:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 100px 50px rgba(0, 0, 0, 0.5);
        transition: all 0.5s;
        opacity: 0.15;
        transform: rotateX(95deg) translateZ(-80px) scale(0.75);
        transform-origin: bottom;
    }

    .playerImageOne:hover a:before,
    .playerImageTwo:hover a:before {
        opacity: 1;
        box-shadow: 0 0 25px 25px rgba(0, 0, 0, 0.5);
        transform: rotateX(0) translateZ(-60px) scale(0.85);
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
            <div class="player-pick-container">
                <h3>Choose your player</h3>
                <div class="player-images-container">
                    <div class="player-one-container">
                        <div class="playerImageOne">
                            <a href="#">
                                <span>Leitet</span>
                            </a>
                        </div>
                        <p>Strength: 20% change to get double score from a ball.</p>
                        <p>Weakness: Afraid of sharks - 50% chance to take double damage.</p>
                    </div>
                    <div class="player-two-container">
                        <div class="playerImageTwo">
                            <a href="#">
                                <span>Loock</span>
                            </a>
                        </div>
                        <p>Strength: Resistant to sharks - 50% chance to avoid damage.</p>
                        <p>Weakness: Afraid of balls - 10% chance to get half points from a ball.</p>
                    </div>
                </div>
            </div>
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
      this._startGameModal = this.shadowRoot.querySelector('#start-game-modal')
      this._playerOneContainer = this.shadowRoot.querySelector('.player-one-container')
      this._playerTwoContainer = this.shadowRoot.querySelector('.player-two-container')
      this._bubbleSharkGameWrapper = this.shadowRoot.querySelector('#bubble-shark-game-wrapper')
      this._scoreEl = this.shadowRoot.querySelector('#score')
      this._missedScoreEl = this.shadowRoot.querySelector('#missed-score')
      this._hitBySharkEl = this.shadowRoot.querySelector('#hit-by-shark')
      this._totalFailsEl = this.shadowRoot.querySelector('#total-fails')

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
      this._intialLoopTiming
      this._gameContainerHeight = this._bubbleSharkGameWrapper.clientHeight
      this._gameContainerWidth = this._bubbleSharkGameWrapper.clientWidth
      this._choosenPlayer = ''

      // Binding this
      this._startGame = this._startGame.bind(this)
      this._playerOneInitiate = this._playerOneInitiate.bind(this)
      this._playerTwoInitiate = this._playerTwoInitiate.bind(this)
      this._addScore = this._addScore.bind(this)
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
      this._playerOneContainer.addEventListener('click', this._playerOneInitiate)
      this._playerTwoContainer.addEventListener('click', this._playerTwoInitiate)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._playerOneContainer.removeEventListener('click', this._playerOneInitiate)
      this._playerTwoContainer.removeEventListener('click', this._playerTwoInitiate)
    }

    /**
     *
     */
    _playerOneInitiate () {
      this._choosenPlayer = 'Leitet'
      this._startGame()
    }

    /**
     *
     */
    _playerTwoInitiate () {
      this._choosenPlayer = 'Loock'
      this._startGame()
    }

    /**
     * @param event
     */
    _startGame (event) {
      this._startGameModal.style.display = 'none'
      this._backgroundMusic.load()
      this._backgroundMusic.play()

      console.log(event)
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

    // Checking if game over
    /**
     *
     */
    _gameEnded () {
      this._gameContainer.innerHTML = `<div class="background">
        <div class="modal">
            <p class="lost-game-text">
                You lost the game! Please try again!
            </p>
            <p class="final-score">
                Final score: <span class="score">${this.score}</span>
            </p>
        </div>
    </div>`

      // this.shootingAudio.pause();
      // this.missedAudio.pause();
      this._backgroundMusic.pause()
    }

    /**
     * This method resets the game.
     */
    _gameEndedRemover () {
      this._missedCount = 0
      this._hitBySharkCount = 0
      this._totalFailsCount = 0
      this._sharkSpeed = 10
      this._dropBallSpeed = 10
      this._score = 0
      this._loopTimingShark = 3250
      this._loopTimingBall = 3250
      this._hitBySharkEl.textContent = this.hitBySharkCount.toString()
      this._totalFailsEl.textContent = this.totalFailsCount.toString()
      this._missedScoreEl.textContent = this.missedCount.toString()
      this._scoreEl.textContent = this.score.toString()

      this._startGame()
    }

    /**
     * @param {object} event The event object.
     */
    _removeShark (event) {
      const targetSharkEl = event.target
      const randomNumber = Math.random()

      // If player is Loock there is a 50% chance to dodge damage from shark.
      if (this._choosenPlayer === 'Loock' && randomNumber < 0.5) {
        this._missedAudio.play()
        targetSharkEl.remove()
        return
      }

      // If player is Leitet there is a 50% chance to take double shark damage.
      if (this._choosenPlayer === 'Leitet' && randomNumber < 0.5) {
        this._hitBySharkCount += 2
        this._totalFailsCount += 2
      } else {
        this._hitBySharkCount += 1
        this._totalFailsCount += 1
      }

      this._totalFailsEl.textContent = `${this._totalFailsCount}`
      this._hitBySharkEl.textContent = `${this._hitBySharkCount}`

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

    /**
     * Creates a ball to be dropped.
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
      ballEl.style.backgroundColor = '#' + this._getRandomNoForBallStyle(899)

      // Doing like this to clear the intervall
      const interval = setInterval(() => {
        if (endPos <= currentTop) {
          clearInterval(interval)
          this._missedAudio.play()
          ballEl.remove()
          this._missedCount += 1
          this._totalFailsCount += 1
          this._missedScoreEl.textContent = `${this._missedCount}`
          this._totalFailsEl.textContent = `${this._totalFailsCount}`
        } else {
          currentTop += 2
          ballEl.style.top = currentTop + 'px'
        }
      }, speed)
      // Binding the inteval to this particular ball
      ballEl.setAttribute('data-interval-id', interval)
    }

    /**
     * @param {object} event The event object.
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
      const randomNumber = Math.random()
      let parsedPoints = parseInt(points)
      // If player is Leitet there is a 20% to get 50% more score from a ball.
      if (this._choosenPlayer === 'Leitet' && randomNumber > 0.8) {
        parsedPoints = parsedPoints * 1.5
      }

      // If player is Loock there is a 10% to get 50% less score from a ball.
      if (this._choosenPlayer === 'Mats' && randomNumber > 0.9) {
        parsedPoints = parsedPoints * 0.5
      }
      this._score += parsedPoints
      this._scoreEl.textContent = `${this._score}`
    }

    /**
     * This method returns a random number used for ball and shark positioning.
     *
     * @param {number} range A number describing the maximum range.
     *
     * @returns {number} Returns a random number between 1 and the given range.
     */
    _getRandomNo (range) {
      return Math.floor(Math.random() * range) + 1
    }

    /**
     * This method returns a random number and is used for drop ball styling.
     *
     * @param {number} range A number describing the maximum range.
     *
     * @returns {number} Returns a random number between 100 and the given range.
     */
    _getRandomNoForBallStyle (range) {
      return Math.floor(Math.random() * range) + 100
    }
  }
)
