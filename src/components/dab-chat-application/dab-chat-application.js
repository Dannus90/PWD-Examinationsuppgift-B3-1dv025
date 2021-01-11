/**
 * The chat-application web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

import '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-converter'
import '@tensorflow/tfjs-core'

const chatIcon = (new URL('assets/chat-application-icon.svg', import.meta.url)).href
const sendMessage = (new URL('assets/send-message.svg', import.meta.url)).href
const settingsIcon = (new URL('assets/settings-icon.svg', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
      #chat-application-wrapper {
        position: relative;
      }

      #websocket-chat {
        list-style: none;
        height: 400px;
        width: 430px;
        padding: 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        background-color: #eafefd;
        margin: 0;
        overflow-y: scroll;
      }

      .chat-application-header {
        position: relative;
        background-color: #f9fbff;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .settings-icon {
        position: absolute;
        top: 12.5px;
        right: 12.5px;
        cursor: pointer;
        outline: none;
      }

      .settings-icon:focus-visible {
        outline: 2px solid #000;
      }
  
      .settings-icon:-moz-focusring {
        outline: 2px solid #000;
      }

      .settings-icon:active {
        transform: scale(0.9);
      }

      .chat-application-header h3 {
        margin: 0;
        padding: 1.5rem;
        text-align: center;
        color: #777777;
      }

      .chat-icon {
        background: linear-gradient(to bottom left, #79C7C5 20%, #A1E2D9 100%);
        border-radius: 50%;
        padding: 0.25rem;
      }

      .list-style-left {
        align-self: flex-start;
        background-color: #b2b2b2;
        border-radius: 10px;
        color: #F9FBFF;
        display: inline-block;
        padding: 0.5rem 1rem;
        position: relative;
        margin-bottom: 1.5rem;
        max-width: 75%;
        line-height: 1.6rem;
        font-size: 0.8rem;
        box-shadow: 5px 7px 13px -13px rgba(0,0,0,0.75);
      }

      .list-style-right {
        align-self: flex-end;
        background-color: #79C7C5;
        border-radius: 10px;
        color: #F9FBFF;
        display: inline-block;
        padding: 0.5rem 1rem;
        position: relative;
        margin-bottom: 1.5rem;
        max-width: 75%;
        line-height: 1.6rem;
        font-size: 0.8rem;
        box-shadow: 5px 7px 13px -13px rgba(0,0,0,0.75);
      }

      .list-style-left:before {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 20px solid #b2b2b2;
        border-right: 10px solid transparent;
        border-top: 10px solid #b2b2b2;
        border-bottom: 16px solid transparent;
        left: 24px;
        bottom: -24px;
      }

      .list-style-right:before {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 20px solid transparent;
        border-right: 20px solid #79C7C5;
        border-top: 20px solid #79C7C5;
        border-bottom: 16px solid transparent;
        right: 24px;
        bottom: -24px;
      }

      #websocket-message {
        color: #035e5c;
        font-size: 1.05rem;
        height: 45px;
        width: 87.5%;
        max-width: 395px;
        background-color: #f9fbff;
        display: flex;
        align-items: center;
        white-space: normal;
        padding: 1rem 4.2rem 2rem 1rem;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        outline: none;
        border: none;
        border-top: 1px solid #ccc;
        resize: none;
        scrollbar-color: #e0dcdc #f7f7f7;
      }

      #websocket-message::-webkit-scrollbar {
        background-color: #f7f7f7;
        width: 16px;
      }
      
      #websocket-message::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #e0dcdc;
        width: 4px;
        border-radius: 11px;
      }
      #f7f7f7;
      #websocket-message::-webkit-scrollbar-track{
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: transparent;
        width: 4px;
        border-radius: 11px;
      }

      form {
        position: relative;
        height: 100px;
      }

      .submit-button {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-50%, -50%);
        color: #a1e2d9;
        background: linear-gradient(to bottom left, #79C7C5 20%, #A1E2D9 100%);
        border: 1px solid 2b2b2b;
        border-radius: 10px;
        font-size: 1em;
        opacity: 0.8;
        cursor: pointer;
        outline: none;
        box-shadow: 5px 13px 13px -13px rgba(0,0,0,0.75);
      }

      .submit-button:-moz-focusring {
        outline: 2px solid #000;
      }

      .submit-button:focus-visible {
        outline: 2px solid #000;
      }
      
      .send-message-icon {
        background: linear-gradient(to bottom left, #79C7C5 20%, #A1E2D9 100%);
        padding: 0.1rem;
        margin-top: 0.1rem;
        margin-right: 0.1rem;
      }

      .send-message-icon:active {
        transform: scale(0.975);
      }

      .pickname-modal {
        position: absolute;
        top: 0;
        left: 0;
        height: 100.1%;
        width: 100%;
        background: rgba(0,0,0,0.75);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        border-bottom-right-radius: 6px;
      }

      .pickname-input {
        padding: 0.5rem 0.75rem;
        outline: none;
        padding-left: 0.25rem;
        border: none;
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

      .emoji-button {
        background: transparent;
        position: absolute;
        top: 65px;
        left: 0px;
        border: none;
        cursor: pointer;
        width: 25px;
        height: 25px;
        font-size: 1.4rem;
        display: flex;
        flex-direction: row;
        outline: none;
      }

      .emoji-span:focus-visible {
        outline: 2px solid #000;
      }

      .emoji-span:-moz-focusring {
        outline: 2px solid #000;
      }

      .emoji-span {
        margin-right: 0.25rem;
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
        flex-direction: column;
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

      .pick-new-nickname-button:active {
        transform: scale(0.98);
      }

      .toggle-channel-button {
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

      .toggle-channel-button:hover {
        color: #22ff01;
      }

      .toggle-channel-button:active {
        transform: scale(0.98);
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

        #websocket-message::-webkit-scrollbar {
          background-color: #f7f7f7;
          width: 16px;
        }
        
        #websocket-message::-webkit-scrollbar-thumb {
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e0dcdc;
          width: 4px;
          border-radius: 11px;
        }

        #websocket-message::-webkit-scrollbar-track{
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: transparent;
          width: 4px;
          border-radius: 11px;
        }

        .time-list-style {
          background-color: none;
          border-radius: none: 
          box-shadow: none;
          color: #868686;
          width: 100%;
          text-align: center;
        }
        </style>

  <div id="chat-application-wrapper">
    <div class="pickname-modal">
      <input class="pickname-input" value="" />
      <p class="nickname-warning-paragraph">Please pick a nickname with atleast 3 characters.</p>
      <button class="pickname-button">Pick name</button>
    </div>
    <div class="chat-application-header">
      <img src="${chatIcon}" class="chat-icon" height="35" width="35" />
      <h3>LNU Messenger App</h3>
      <img tabindex="0" src="${settingsIcon}" class="settings-icon" height="20" width="20" />
      <div class="toggle-menu">
        <button class="pick-new-nickname-button">New nickname</button>
        <button class="toggle-channel-button">Private chat</button>
      </div> 
    </div>
    <ul id="websocket-chat"></ul>
    <form>
      <textarea rows="8" cols="80" id="websocket-message" value=""></textarea>
      <button tabindex="0" class="submit-button" type="submit"><img src="${sendMessage}" class="send-message-icon" height="20" width="20" />
      </button>
      <button tabindex="-1" class="emoji-button"><span tabindex="0" class="emoji-span">😀</span><span>&laquo;</span></button>
    </form>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('dab-chat-application',
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

      // Websocket related variables.
      this._websocketConnection = ''

      this._userInput = ''

      this._userName = 'Gammelgäddan57'

      this._apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

      this._currentChannel = 'my, not so secret, channel'

      // Other variables
      this._toggleMenuVisible = false

      // Selecting the websocket chat container.
      this._webSocketChat = this.shadowRoot.querySelector('#websocket-chat')

      // Selecting the websocket message field.
      this._webSocketMessage = this.shadowRoot.querySelector('#websocket-message')

      // Selecting the submit button
      this._submitButton = this.shadowRoot.querySelector('.submit-button')

      // Selecting the pickname input.
      this._picknameInput = this.shadowRoot.querySelector('.pickname-input')

      // Selecting the pickname button.
      this._picknameButton = this.shadowRoot.querySelector('.pickname-button')

      // Selecting the emoji button.
      this._emojiButton = this.shadowRoot.querySelector('.emoji-button')

      // Selecting the settings icon.
      this._settingsIcon = this.shadowRoot.querySelector('.settings-icon')

      // Selecting the toggle menu.
      this._toggleMenu = this.shadowRoot.querySelector('.toggle-menu')

      // Selecting the pick new nickname button.
      this._pickNewNicknameButton = this.shadowRoot.querySelector('.pick-new-nickname-button')

      // Toggle channel button
      this._toggleChannelButton = this.shadowRoot.querySelector('.toggle-channel-button')

      // Selecting the nickname warning paragraph.
      this._nicknameWarningParagraph = this.shadowRoot.querySelector('.nickname-warning-paragraph')

      // Variables related to message time display in chat.
      this._monthsArray = ['JAN', 'FEB', 'MARS', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OKT', 'NOV', 'DEC']
      this._lastTimeOutput = ''

      // Variables related to indexedDB
      this._dbName = 'PWDApplicationDatabase'
      this._dbVersion = 1
      this._recentChatNameDbStore = 'ChatNicknameStore'
      this._request = indexedDB.open(this._dbName, this._dbVersion)
      this._db = ''

      // Binding this to class methods.
      this._submitUserMessage = this._submitUserMessage.bind(this)
      this._updateUserInput = this._updateUserInput.bind(this)
      this._pickName = this._pickName.bind(this)
      this._toggleSettingsMenu = this._toggleSettingsMenu.bind(this)
      this._openNickNameModal = this._openNickNameModal.bind(this)
      this._showNicknameWarning = this._showNicknameWarning.bind(this)
      this._switchMessageChannel = this._switchMessageChannel.bind(this)
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
      const input = this._webSocketMessage
      // eslint-disable-next-line no-undef
      const picker = new EmojiButton({
        position: 'top-start'
      })

      picker.on('emoji', (emoji) => {
        input.value += emoji
        this._userInput += emoji
      })

      // Adding event listeners
      this._emojiButton.addEventListener('click', (event) => {
        event.preventDefault()
        picker.pickerVisible ? picker.hidePicker() : picker.showPicker(input)
      })
      this._submitButton.addEventListener(('click'), this._submitUserMessage)
      this._webSocketMessage.addEventListener(('input'), this._updateUserInput)
      this._picknameButton.addEventListener(('click'), this._pickName)
      this._settingsIcon.addEventListener(('click'), this._toggleSettingsMenu)
      this._pickNewNicknameButton.addEventListener(('click'), this._openNickNameModal)
      this._toggleChannelButton.addEventListener(('click'), this._switchMessageChannel)

      // Establishing the websocket connection
      const webSocketConnection = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      this._websocketConnection = webSocketConnection

      /**
       * This one runs when the web socket connection is opened.
       * It appends an list item to the unordered list.
       */
      webSocketConnection.onopen = () => {
        const li = document.createElement('li')
        li.innerText = 'Welcome to LNU Messenger App!'
        li.classList.add('list-style-right')
        this._webSocketChat.appendChild(li)
      }

      /**
       * This one runs when the web socket connection is closed.
       */
      webSocketConnection.onclose = () => {
        console.error('disconnected')
      }

      /**
       * This one runs on web socket connection error and displays a message and the error.
       *
       * @param {object} error The error event object.
       */
      webSocketConnection.onerror = (error) => {
        console.error('Connection could not be established', error)
      }

      /**
       * This runs when a message is recieved from the server and we append it to the chat and also scroll if needed.
       *
       * @param {object} event The event object with the data recieved from the server.
       */
      webSocketConnection.onmessage = (event) => {
        // Parsing the retrieved data.
        const parsedData = JSON.parse(event.data)

        // If the recieved type is a heartbeat or the username is The Server we return.
        if (parsedData.type === 'heartbeat' || parsedData.username === 'The Server') {
          return
        }
        const { data, username } = parsedData
        const li = document.createElement('li')

        const currDate = new Date()
        const messageTimeDisplay = `${currDate.getDate()} ${this._monthsArray[currDate.getMonth()]} ${currDate.getHours()}:${currDate.getMinutes()}`

        // Checking if time updated since last message and if new time should be shown.
        if (messageTimeDisplay !== this._lastTimeOutput) {
          const liForTime = document.createElement('li')
          liForTime.innerText = messageTimeDisplay
          liForTime.classList.add('time-list-style')
          this._webSocketChat.appendChild(liForTime)
          this._lastTimeOutput = messageTimeDisplay
        }

        if (parsedData.username === this._userName) {
          li.classList.add('list-style-left')
        } else {
          li.classList.add('list-style-right')
        }

        // Appending username and data to the chat.
        li.innerText = `${username}: ${data}`
        this._webSocketChat.appendChild(li)
        // Scrolling to the bottom of the chat.
        this._webSocketChat.scrollTop = this._webSocketChat.scrollHeight
      }

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

        const recentChatNameDbStoreInstance = this._db.transaction(this._recentChatNameDbStore, 'readonly').objectStore(this._recentChatNameDbStore)
        /**
         * Gets all current data in the large memory store.
         * Sends the data to the highscore component.
         *
         * @param {object} e The event object.
         */
        recentChatNameDbStoreInstance.getAll().onsuccess = async (e) => {
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
      this._emojiButton.removeEventListener('click', (event) => {})
      this._submitButton.removeEventListener(('click'), this._submitUserMessage)
      this._webSocketMessage.removeEventListener(('input'), this._updateUserInput)
      this._picknameButton.removeEventListener(('click'), this._pickName)
      this._settingsIcon.removeEventListener(('click'), this._toggleSettingsMenu)
      this._pickNewNicknameButton.removeEventListener(('click'), this._openNickNameModal)
      this._toggleChannelButton.addEventListener(('click'), this._switchMessageChannel)
    }

    /**
     * We return if user input is empty, otherwise a message is sent to the server.
     * Afterwards the variables are resetted.
     *
     * @param {object} event The event object.
     */
    _submitUserMessage (event) {
      event.preventDefault()
      if (this._userInput === '') {
        return
      }

      const data = {
        type: 'message',
        data: this._userInput,
        username: this._userName,
        channel: this._currentChannel,
        key: this._apiKey
      }

      this._websocketConnection.send(JSON.stringify(data))
      this._userInput = ''
      this._webSocketMessage.value = ''
    }

    /**
     * Updates the current user input to the value.
     *
     * @param {object} root0 The root object.
     * @param {object} root0.target The target from which we extract the value.
     * @param {string} root0.target.value A string containing the user input.
     */
    _updateUserInput ({ target: { value } }) {
      this._userInput = value
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

      this._userName = this._picknameInput.value
      this.shadowRoot.querySelector('.pickname-modal').style.display = 'none'
      this.dispatchEvent(new window.CustomEvent('pickedChatName', {
        bubbles: true,
        composed: true,
        detail: {
          pickedName: this._userName,
          dbStore: this._recentChatNameDbStore
        }
      }))
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
     * This method is responsible for switching channels.
     */
    _switchMessageChannel () {
      this._toggleMenuVisible = !this._toggleMenuVisible
      this._toggleMenu.style.transform = 'scale(0.00)'

      if (this._currentChannel === 'my, not so secret, channel') {
        this._currentChannel = 'daniels private channel'
        this._toggleChannelButton.textContent = 'Switch to LNU'
      } else if (this._currentChannel === 'daniels private channel') {
        this._currentChannel = 'my, not so secret, channel'
        this._toggleChannelButton.textContent = 'Switch to private'
      }
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
