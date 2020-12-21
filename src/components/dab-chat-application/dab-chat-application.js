/**
 * The chat-application web component module.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

const chatIcon = (new URL(`assets/chat-application-icon.svg`, import.meta.url)).href
const sendMessage = (new URL(`assets/send-message.svg`, import.meta.url)).href

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
        background-color: #f9fbff;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
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

      #websocket-chat li {
        background-color: #79C7C5;
        border-radius: 10px;
        color: #F9FBFF;
        display: inline-block;
        padding: 0.25rem 1rem;
        position: relative;
        margin-bottom: 1.5rem;
        max-width: 75%;
        line-height: 1.6rem;
        font-size: 0.8rem;
      }

      #websocket-chat li:nth-child(odd) {
        align-self: flex-start;
        background-color: #b2b2b2;
      }

      #websocket-chat li:nth-child(even) {
        align-self: flex-end;
        background-color: #79C7C5;
      }

      #websocket-chat li:nth-child(odd):before {
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

      #websocket-chat li:nth-child(even):before {
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
        color: #79c7c5;
        font-size: 1.05rem;
        height: 100%;
        width: 100%;
        max-width: 442px;
        background-color: #f9fbff;
        display: flex;
        align-items: center;
        white-space: normal;
        padding: 1rem;
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
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.85);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .pickname-input {
        padding: 0.5rem 0.75rem;
        outline: none;
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
        padding: 10px 26px;
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
  </style>

  <div id="chat-application-wrapper">
    <div class="pickname-modal">
      <input class="pickname-input" value="" />
      <button class="pickname-button">Pick name</button>
    </div>
    <div class="chat-application-header"><img src="${chatIcon}" class="chat-icon" height="35" width="35" /><h3>LNU Messenger App</h3></div>
    <ul id="websocket-chat"></ul>
    <form>
      <textarea rows="8" cols="80" id="websocket-message" value=""></textarea>
      <button class="submit-button" type="submit"><img src="${sendMessage}" class="send-message-icon" height="20" width="20" />
      </button>
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

      // Binding this.
      this._submitUserMessage = this._submitUserMessage.bind(this)

      this._updateUserInput = this._updateUserInput.bind(this)

      this._pickName = this._pickName.bind(this)
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
      this._submitButton.addEventListener(('click'), this._submitUserMessage)
      this._webSocketMessage.addEventListener(('input'), this._updateUserInput)
      this._picknameButton.addEventListener(('click'), this._pickName)

      const webSocketConnection = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      this._websocketConnection = webSocketConnection

      webSocketConnection.onopen = () => {
        const li = document.createElement('li');
        li.innerText = 'Welcome to LNU Messenger App!'
        this._webSocketChat.appendChild(li)
      }

      webSocketConnection.onclose = () => {
        console.error('disconnected');
      }

      webSocketConnection.onerror = (error) => {
        console.error('Connection could not be established', error)
      }

      webSocketConnection.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        const { data, type, username} = parsedData
        console.log('received', event.data);
        const li = document.createElement('li');
        li.innerText = `${username}: ${data}`
        this._webSocketChat.appendChild(li)
        // Scrolling to the bottom of the chat.
        this._webSocketChat.scrollTop = this._webSocketChat.scrollHeight
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }

    _submitUserMessage (event) {
      event.preventDefault()
      if(this._userInput === '') {
        return
      }

      const data = {
        type: "message",
        data: this._userInput,
        username: this._userName,
        channel: "my, not so secret, channel",
        key: this._apiKey
      }

      this._websocketConnection.send(JSON.stringify(data))
      this._userInput = ''
      this._webSocketMessage.value = ''
    }

    _updateUserInput ({ target: { value } }) {
      console.log(value)
      this._userInput = value
    }
    // TODO ADD WARNING IF THE PICKEDNAME IS TO SHORT!
    _pickName (event) {
      event.preventDefault()
      this._userName = this._picknameInput.value
      this.shadowRoot.querySelector('.pickname-modal').style.display = 'none'
    }
  }
)
