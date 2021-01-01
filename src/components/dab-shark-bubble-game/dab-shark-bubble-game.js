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
        height: 3rem;
        width: 7rem;
    }

    .ball {
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    
        -webkit-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        -moz-box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2),
            inset 0px 10px 30px 5px rgba(255, 255, 255, 1);
    
        height: 100px;
        position: absolute;
        width: 100px;
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
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#80ffffff', endColorstr='#00ffffff',GradientType=1 );
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        -webkit-box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
        -moz-box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 20px 30px rgba(255, 255, 255, 0.3);
        content: "";
        height: 100px;
        left: 0;
        position: absolute;
        width: 100px;
    }

  </style>

  <div id="bubble-shark-game-wrapper">
    <div id="container" class="game-area"></div>

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
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
