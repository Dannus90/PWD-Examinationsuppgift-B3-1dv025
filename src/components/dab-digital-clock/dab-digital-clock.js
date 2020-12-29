/**
 * The application-icon web component module.
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
    .digital-clock-wrapper {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-family: 'Share Tech Mono', monospace;
        text-align: center;
        color: #daf6ff;
        text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
        /* background: #0f3854;
        background: radial-gradient(ellipse at center,  #0a2e38  0%, #000000 70%);
        background-size: 100%; */
        padding: 0.65rem 1.2rem;
        border-radius: 50px;
    }

    .digital-clock-time,
    .digital-clock-date {
        margin: 0;
        padding: 0;
        line-height: 1.5rem;
    }

    .digital-clock-time {
        letter-spacing: 0.05em;
        font-size: 18px;
    }

    .digital-clock-date {
        letter-spacing: 0.1em;
        font-size: 14px;
    }


  </style>
  <div class="digital-clock-wrapper">
    <p class="digital-clock-date">2020-12-29 Tue</p>
    <p class="digital-clock-time">12:45:05</p>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-digital-clock',
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

      this._timerInterval = ''
      this._weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

      this._digitalClockDate = this.shadowRoot.querySelector('.digital-clock-date')
      this._digitalClockTime = this.shadowRoot.querySelector('.digital-clock-time')
      this._updateTime = this._updateTime.bind(this)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['name', 'src']
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
      this._timerInterval = setInterval(this._updateTime, 1000)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      clearInterval(this._timerInterval)
    }

    /**
     * This method is responsible for updating time each second.
     */
    _updateTime () {
      const currDate = new Date()
      const time = this._formatTime(currDate.getHours(), 2) + ':' + this._formatTime(currDate.getMinutes(), 2) + ':' + this._formatTime(currDate.getSeconds(), 2)
      const date = this._formatTime(currDate.getFullYear(), 4) + '-' + this._formatTime(currDate.getMonth() + 1, 2) + '-' + this._formatTime(currDate.getDate(), 2) + ' ' + this._weekDays[currDate.getDay()]
      this._digitalClockDate.textContent = date
      this._digitalClockTime.textContent = time
    }

    /**
     * This method returns a formatted string, that will be a part of the time displayed in the clock.
     *
     * @param {number} num A number describing a part of the day (hours, minutes) or months/years etc.
     * @param {number} digit A number representing how many digits should be displayed.
     *
     * @returns {string} Returns a string with a part of the time that will be displayed in the clock.
     */
    _formatTime (num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    }
  }
)
