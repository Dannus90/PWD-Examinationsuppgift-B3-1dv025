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
let uniqueId = 1
const applicationArray = []

// --- TARGETING DOM ELEMENTS --- //
const pwdApplication = document.querySelector('#pwd-application')

/// //////////////////////////
//  ADDING EVENT LISTENERS  //
/// //////////////////////////
document.addEventListener('createNewAppInstance', ({detail: {applicationName}}) => { 
    // Creating a new instance of a specific application based on the detail name.
    const application = document.createElement(applicationName)
    const applicationWindow = document.createElement('dab-game-window')
    applicationWindow.setAttribute('slot', 'application')
    applicationWindow.setAttribute('id', uniqueId)

    application.setAttribute('slot', 'application-container')

    applicationWindow.appendChild(application)

    applicationWindow.style.position = 'absolute'
    applicationWindow.style.top = '50%'
    applicationWindow.style.left = '50%'
    applicationWindow.style.transform = `translate(${translationPositionX}%, ${translationPositionY}%)`

    translationPositionX -= 2
    translationPositionY -= 2

    applicationArray.push(applicationWindow)

    pwdApplication.appendChild(applicationWindow)
})

document.addEventListener('mouseup', (event) => {
    event.target.dispatchEvent(new window.CustomEvent('doneMoving', {
        bubbles: true,
        composed: true,
    }))
})

document.addEventListener('deleteAppInstance', (event) => {
    const applicationIndex = applicationArray.indexOf(event.detail.applicationName)
    
    // Remove the specific application instance from the array. 
    if (applicationIndex > -1) {
        applicationArray.splice(applicationIndex, 1);
    }
      
    event.detail.applicationName.remove()
    translationPositionY += 2
    translationPositionX += 2
})

document.addEventListener('elementInFocus', (event) => {
    applicationArray.forEach((app) => {
        app.setZIndex(event.detail.currentInstance)
    })
})