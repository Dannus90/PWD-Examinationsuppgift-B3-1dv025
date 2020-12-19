/**
 * The main script file of the application.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

// --- IMPORTS --- //
import './components/dab-pwd-application/dab-pwd-application'
import './components/dab-game-window/dab-game-window'
import './components/dab-memory-game/dab-memory-game'
import './components/dab-memory-game/dab-flipping-tile/dab-flipping-tile'
import './components/dab-chat-application/dab-chat-application'
import './components/dab-face-detection-application/dab-face-detection-application'
import './components/dab-application-icon/dab-application-icon'

// Variables
let translationPositionX = -50
let translationPositionY = -50

// --- TARGETING DOM ELEMENTS --- //
const pwdApplication = document.querySelector('#pwd-application')

/// //////////////////////////
//  ADDING EVENT LISTENERS  //
/// //////////////////////////
document.addEventListener('createNewAppInstance', (event) => { 
    console.log(event.detail.applicationName)
    const application = document.createElement(event.detail.applicationName)
    const applicationWindow = document.createElement('dab-game-window')
    applicationWindow.setAttribute('slot', 'application')
    application.setAttribute('slot', 'application-container')

    applicationWindow.appendChild(application)

    applicationWindow.style.position = 'absolute'
    applicationWindow.style.top = '50%'
    applicationWindow.style.left = '50%'
    applicationWindow.style.transform = `translate(${translationPositionX}%, ${translationPositionY}%)`

    translationPositionX -= 2
    translationPositionY -= 2

    pwdApplication.appendChild(applicationWindow)
})

document.addEventListener('mouseup', (event) => {
    event.target.dispatchEvent(new window.CustomEvent('doneMoving', {
        bubbles: true,
        composed: true,
    }))
})

document.addEventListener('deleteAppInstance', (event) => {
    event.detail.applicationName.remove()
    translationPositionY += 2
    translationPositionX += 2
})