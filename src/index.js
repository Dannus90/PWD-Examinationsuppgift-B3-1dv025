/**
 * The main script file of the application.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

// --- IMPORTS --- //
import './components/dab-pwd-application/dab-pwd-application'
import './components/dab-game-window/dab-game-window'
import './components/dab-game-window/dab-game-window'
import './components/dab-memory-game/dab-flipping-tile/dab-flipping-tile'
import './components/dab-chat-application/dab-chat-application'
import './components/dab-face-detection-application/dab-face-detection-application'
import './components/dab-application-icon/dab-application-icon'



/// //////////////////////////
//  ADDING EVENT LISTENERS  //
/// //////////////////////////
document.addEventListener('createNewAppInstance', (event) => { 
    console.log(event.detail.applicationName)
    document.createElement(event.detail.applicationName)
})

document.addEventListener('mouseup', (event) => {
    event.target.dispatchEvent(new window.CustomEvent('doneMoving', {
        bubbles: true,
        composed: true,
    }))
})

document.addEventListener('deleteAppInstance', (event) => {
    event.detail.applicationName.remove()
})