/**
 * The main script file of the application.
 *
 * @author Daniel Persson<dp222jd@student.lnu.se>
 * @version 1.0.0
 */

// --- IMPORTS --- //
import './components/dab-pwd-application/dab-pwd-application'
import './components/dab-application-window/dab-application-window'
import './components/dab-memory-game/dab-memory-game'
import './components/dab-memory-game/dab-flipping-tile/dab-flipping-tile'
import './components/dab-chat-application/dab-chat-application'
import './components/dab-object-detection-application/dab-object-detection-application'
import './components/dab-application-icon/dab-application-icon'
import './components/dab-memory-game/dab-high-score/index'
import './components/dab-shark-bubble-game/dab-shark-bubble-game.js'
import './components/dab-digital-clock/index'
import './registerServiceWorker/registerServiceWorker.js'

// Importing the db and related variables.
import { getStore, clearStore, smallMemoryDbStore, mediumMemoryDbStore, largeMemoryDbStore } from './db/indexedDB.js'

// Variables
const translationPositionX = -50
const translationPositionY = -50
let windowPositionTop = 50
let windowPositionLeft = 50
const applicationArray = []

// --- TARGETING DOM ELEMENTS --- //
const pwdApplication = document.querySelector('#pwd-application')

/// //////////////////////////
//  ADDING EVENT LISTENERS  //
/// //////////////////////////

// --- CREATING AND DELETING APP INSTANCES EVENTLISTENERS --- //
document.addEventListener('createNewAppInstance', ({ detail: { applicationName } }) => {
  // Creating a new instance of a specific application based on the detail name.
  const application = document.createElement(applicationName)
  const applicationWindow = document.createElement('dab-application-window')
  applicationWindow.setAttribute('slot', 'application')

  application.setAttribute('slot', 'application-container')

  applicationWindow.appendChild(application)

  applicationWindow.style.position = 'absolute'
  applicationWindow.style.top = `${windowPositionTop}%`
  applicationWindow.style.left = `${windowPositionLeft}%`
  applicationWindow.style.transform = `translate(${translationPositionX}%, ${translationPositionY}%)`

  windowPositionTop -= 1
  windowPositionLeft -= 1

  applicationArray.push(applicationWindow)

  pwdApplication.appendChild(applicationWindow)

  applicationWindow.addEventListener(('mousedown'), () => {
    applicationWindow.style.zIndex = 1000

    // Setting the z-index to 1 on all other applications that are not the current one.
    applicationArray.filter((app) => app !== applicationWindow).forEach((app) => {
      app.style.zIndex = 1
    })
  })
})

document.addEventListener('deleteAppInstance', ({ detail: { applicationName } }) => {
  const applicationIndex = applicationArray.indexOf(applicationName)

  // Remove the specific application instance from the array.
  if (applicationIndex > -1) {
    applicationArray.splice(applicationIndex, 1)
  }

  windowPositionTop += 1
  windowPositionLeft += 1

  applicationName.removeEventListener(('mousedown'), () => {
    applicationName.style.zIndex = 1000

    // Setting the z-index to 1 on all other applications that are not the current one.
    applicationArray.filter((app) => app !== applicationName).forEach((app) => {
      app.style.zIndex = 1
    })
  })

  applicationName.remove()
})

// --- MOUSE EVENT RELATED EVENTLISTENERS--- //
document.addEventListener('mouseup', (event) => {
  event.target.dispatchEvent(new window.CustomEvent('doneMoving', {
    bubbles: true,
    composed: true
  }))
})

// --- MEMORY GAME RELATED EVENTLISTENERS--- //
document.addEventListener('updateHighscore', ({ detail: { highscoreToBeDisplayed, currentHighscoreComponent } }) => {
  currentHighscoreComponent.updateHighscore(highscoreToBeDisplayed)
})

document.addEventListener('memoryGameOver', ({ detail: { numberOfTries, totalTimeSpent, boardsize, nickname } }) => {
  let accessedStore = ''
  if (boardsize === 'small') {
    accessedStore = getStore(smallMemoryDbStore, 'readwrite')
  } else if (boardsize === 'medium') {
    accessedStore = getStore(mediumMemoryDbStore, 'readwrite')
  } else if (boardsize === 'large') {
    accessedStore = getStore(largeMemoryDbStore, 'readwrite')
  }

  const data = {
    nickname: nickname,
    numberOfTries,
    time: totalTimeSpent
  }

  accessedStore.add(data)
})

document.addEventListener('resetMemoryGame', ({ detail: { boardsize, currentHighscoreComponent } }) => {
  currentHighscoreComponent.updateHighscore(boardsize)
})

document.addEventListener('pickedMemoryName', ({ detail: { pickedName, dbStore } }) => {
  // Clearing the previously stored name.
  clearStore(dbStore, 'readwrite')
  const recentNameStore = getStore(dbStore, 'readwrite')
  const data = {
    nickname: pickedName
  }

  // Adding new nickname to the store.
  recentNameStore.add(data)
})

// --- CHAT APPLICATION RELATED EVENTLISTENERS--- //

document.addEventListener('pickedChatName', ({ detail: { pickedName, dbStore } }) => {
  // Clearing the previously stored name.
  clearStore(dbStore, 'readwrite')
  const recentNameStore = getStore(dbStore, 'readwrite')
  const data = {
    nickname: pickedName
  }

  // Adding new nickname to the store.
  recentNameStore.add(data)
})
