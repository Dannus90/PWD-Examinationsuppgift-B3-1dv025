/**
 * The face-detection web component module.
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
    #face-detection-application-wrapper {
      margin: 1.5rem;
      color: #3D3D3D;
    }

    #face-detection-application-wrapper h3 {
      color: #FF6F00;
      line-height: 1.6rem;
    }

    #webcam {
      display: block;
    }

    .description-paragraph {
      line-height: 1.6rem;
    }

    .video-section-wrapper {
      opacity: 1;
      transition: opacity 500ms ease-in-out;
    }

    .removed {
      display: none;
    }
    
    .invisible {
      opacity: 0.2;
    }
    
    .cam-view-wrapper {
      position: relative;
      float: left;
      width: calc(100% - 20px);
      margin: 10px;
      cursor: pointer;
    }

    .enable-webcam-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      background-image: linear-gradient(
        110deg,
        var(--bg-color-primary) 0%,
        var(--bg-color-secondary) 50%,
        var(--bg-color-tertiary) 89%
      );
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.05s ease-in;
    }

    .enable-webcam-button:hover {
      background-image: linear-gradient( 50deg, var(--bg-color-primary) 0%, var(--bg-color-secondary) 50%, var(--bg-color-tertiary) 89% );
      transform: scale(1.02);
      box-shadow: 2px 2px 16px -8px rgba(0,0,0,0.75);
    }

    .enable-webcam-button:active {
      transform: scale(0.98);
    }
    
    .cam-view-wrapper p {
      position: absolute;
      padding: 5px;
      background-color: rgba(255, 111, 0, 0.85);
      color: #FFF;
      border: 1px dashed rgba(255, 255, 255, 0.7);
      z-index: 2;
      font-size: 12px;
    }
    
    .highlighter {
      background: rgba(0, 0, 255, 0.25);
      border: 1px dashed #fff;
      z-index: 1;
      position: absolute;
    }
  </style>

  <div id="face-detection-application-wrapper">
    <h3>This app is using a pretrained model in Tensorflow.js for object detection.</h3>
    <p class="description-paragraph">Before you can click the button to enable your camera you have to wait for the model to load.</p>
    <section id="video-section-wrapper" class="invisible">
      <p class="description-paragraph">When ready click "enable webcam" below and accept access to the webcam when the browser asks (check the top left of your window). Hold an objects up close to your webcam. </p>
      <div id="live-view-wrapper" class="cam-view-wrapper">
        <button class="enable-webcam-button">Enable your webcam</button>
        <video id="webcam" autoplay width="480" height="360"></video>
      </div>
    </section>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-face-detection-application',
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

      // Selecting the web cam.
      this._webcam = this.shadowRoot.querySelector('#webcam')

      // Selecting the live view wrapper.
      this._liveViewWrapper = this.shadowRoot.querySelector('#live-view-wrapper')

      // Selecting the video section wrapper.
      this._videoSectionWrapper = this.shadowRoot.querySelector('#video-section-wrapper')

      // Enable web cam button.
      this._enableWebcamButton = this.shadowRoot.querySelector('.enable-webcam-button')

      // The model.
      this._model = undefined

      // Children
      this._children = []

      // Binding this.
      this._enableWebcam = this._enableWebcam.bind(this)

      this._predictWebcam = this._predictWebcam.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['']
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
       * A check is made to see if webcam access is supported.
       *
       * @returns {boolean} Returns either true or false.
       */
      const getUserMediaSupported = () => {
        return !!(navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia)
      }

      // If webcam is supported in the browser we add an event listener
      // to the enable webcam button. This button is responsible
      // for calling the enableWebCam function.
      if (getUserMediaSupported()) {
        this._enableWebcamButton.addEventListener('click', this._enableWebcam)
        cocoSsd.load().then((loadedModel) => {
          this._model = loadedModel
          // Show demo section now model is ready to use.
          this._videoSectionWrapper.classList.remove('invisible')
        })
      } else {
        // TODO ADD VISUAL WARNING HERE!
        console.warn('getUserMedia() is not supported by your browser')
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._enableWebcamButton.removeEventListener('click', this._enableWebcam)
      this._webcam.removeEventListener('loadeddata', this._predictWebcam)
    }

    /**
     * The event used to style the event target.
     *
     * @param {object} event The event object.
     */
    _enableWebcam (event) {
      if (!this._model) {
        // TODO DISPLAY THAT NO MODEL IS AVAILABLE
        console.log('no model!')
        return
      }

      event.target.classList.add('removed')
      this._videoSectionWrapper.classList.remove('invisible')

      const constraints = {
        video: true
      }

      // Activating the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this._webcam.srcObject = stream
        this._webcam.addEventListener('loadeddata', this._predictWebcam)
      })
    }

    /**
     * This method is responsible for displaying the object predictions on the screen.
     */
    _predictWebcam () {
      // Now let's start classifying a frame in the stream.
      this._model.detect(this._webcam).then((predictions) => {
        this._children.forEach((child) => {
          this._liveViewWrapper.removeChild(child)
        })

        console.log(this._children.length)
        this._children.splice(0)

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for (let n = 0; n < predictions.length; n++) {
          // If we are over 60% sure we are sure we classified it right, draw it!
          if (predictions[n].score > 0.6) {
            const p = document.createElement('p')
            p.innerText = `${this._capitalize(predictions[n].class)} with ${Math.round(parseFloat(predictions[n].score) * 100)} % confidence`
            p.style = `
                margin-left: ${(predictions[n].bbox[0] * 0.75)}px;
                margin-top: ${((predictions[n].bbox[1] - 10) * 0.5)}px;
                width: ${((predictions[n].bbox[2] - 10) * 0.75)}px;
                top: 0;
                left: 0;
                `

            // Setting up the detection box.
            const highlighter = document.createElement('div')
            highlighter.setAttribute('class', 'highlighter')
            highlighter.style = `
                left: ${(predictions[n].bbox[0] * 0.75)}px;
                top: ${(predictions[n].bbox[1] * 0.50)}px; 
                width: ${(predictions[n].bbox[2] * 0.75)}px;
                height: ${(predictions[n].bbox[3] * 0.85)}px;
                `

            // Appending the elements to the live-view-wrapper.
            this._liveViewWrapper.appendChild(highlighter)
            this._liveViewWrapper.appendChild(p)
            this._children.push(highlighter)
            this._children.push(p)
          }
        }

        // We call the function again to keep prediciting but we set a delay for a smoother behavior.
        setTimeout(() => {
          window.requestAnimationFrame(this._predictWebcam)
        }, 500)
      })
    }

    /**
     * This method capitalizes a string.
     *
     * @param {string} string A string to be capitalized.
     * @returns {string} Returns a capitalized string.
     */
    _capitalize (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
)
