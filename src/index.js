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
import './components/dab-memory-game/dab-high-score/index'

// Variables
let translationPositionX = -50
let translationPositionY = -50
const uniqueId = 1
const applicationArray = []

// --- TARGETING DOM ELEMENTS --- //
const pwdApplication = document.querySelector('#pwd-application')

// --- INITIALIZE VARIABLE FOR DB --- //
let db

/// //////////////////////////
//   SETTING UP INDEXEDDB   //
/// //////////////////////////

(async () => {
  // If indexedDB is not supported we exit
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB')
    return
  }

  const request = indexedDB.open(dbName, dbVersion)

  /**
   * Handles request errors.
   *
   * @param {object} errorEvent The object event.
   */
  request.onerror = (errorEvent) => {
    console.error(`A request error occured: ${errorEvent.target.error.message}`)
  }

  /**
   * Handles request on success.
   *
   * @param {object} e The object event.
   */
  request.onsuccess = async (e) => {
    db = await e.target.result
    console.log(`${e.target.result.name} was opened successfully.`)

    const quizDbStoreInstance = db.transaction(quizDbStore, 'readonly').objectStore(quizDbStore)
    const recentNameStoreInstance = db.transaction(recentNameDbStore, 'readonly').objectStore(recentNameDbStore)

    /**
     * Gets all current data in the quizStore. Sets the highscore of the highscore component.
     *
     * @param {object} e The event object.
     */
    quizDbStoreInstance.getAll().onsuccess = async (e) => {
      const quizData = await e.target.result
      highScore.highScore = quizData
    }

    /**
     * Checks the a nickname currently exists in indexedDb and if it exists it sets name to already be picked for the player.
     *
     * @param {object} e The event object.
     */
    recentNameStoreInstance.getAll().onsuccess = async (e) => {
      const recentNickname = await e.target.result[0].nickname
      if (recentNickname) {
        nicknameGameController.nameExistInDb(recentNickname)
      }
    }
  }

  /**
   * Handles upgrading of the database.
   *
   * @param {object} e The object event.
   */
  request.onupgradeneeded = async (e) => {
    db = await e.target.result

    /**
     * Handles database errors.
     *
     * @param {object} errorEvent The object event.
     */
    db.onerror = (errorEvent) => {
      console.error('Database error: ', errorEvent.target.error.message)
    }

    // Setting up store for score saving
    const quizObjectStore = db.createObjectStore(quizDbStore, { keyPath: 'id', autoIncrement: true })
    quizObjectStore.createIndex(nickNameIndex, nickNameIndex, { unique: false })
    quizObjectStore.createIndex(scoreIndex, scoreIndex, { unique: false })
    quizObjectStore.createIndex(dateIndex, dateIndex, { unique: false })

    // Setting up store for recent nickname
    const nicknameObjectStore = await db.createObjectStore(recentNameDbStore, { keyPath: 'id', autoIncrement: true })
    nicknameObjectStore.createIndex(recentNameIndex, recentNameIndex, { unique: false })

    // --- SEED DATA ---//
    // Small sized memory game
    const seedDataMemorySmall = [{
      nickname: 'MrMemory',
      numberOfTries: 2,
      time: 15
    },
    {
      nickname: 'MsMemory',
      numberOfTries: 3,
      time: 17
    },
    {
      nickname: 'LordMemory',
      numberOfTries: 4,
      time: 20
    }]

    // Medium sized memory game
    const seedDataMemoryMedium = [{
      nickname: 'MrMemory',
      numberOfTries: 9,
      time: 15
    },
    {
      nickname: 'MsMemory',
      numberOfTries: 11,
      time: 17
    },
    {
      nickname: 'LordMemory',
      numberOfTries: 13,
      time: 20
    }]

    // Large sized memory game
    const seedDataMemoryLarge = [{
      nickname: 'MrMemory',
      numberOfTries: 18,
      time: 40
    },
    {
      nickname: 'MsMemory',
      numberOfTries: 22,
      time: 50
    },
    {
      nickname: 'LordMemory',
      numberOfTries: 24,
      time: 60
    }]

    /**
     * Seeding the database with fake players.
     *
     * @param {object} e The object event.
     */
    quizObjectStore.transaction.oncomplete = async (e) => {
      const accessedQuizStore = await db.transaction('QuizStore', 'readwrite').objectStore('QuizStore')
      seedData.forEach((seedPlayer) => {
        accessedQuizStore.add(seedPlayer)
      })
    }
  }
})()

/// /////////////////////////
//     HELPER METHODS      //
/// /////////////////////////

/**
 * Returns the chosen store.
 *
 * @param {string} storeName The name of the store.
 * @param {string} method The method type.
 *
 * @returns {object} An object representing the accessed store
 */
const getStore = (storeName, method) => {
  const accessedStore = db.transaction(storeName, method).objectStore(storeName)
  if (!accessedStore) {
    console.error('No such store exist!')
  }
  return accessedStore
}

/**
 * Clears a storage.
 *
 * @param {string} storeName The name of the store.
 * @param {string} method The method type.
 */
const clearStore = (storeName, method) => {
  const accessedStore = getStore(storeName, method)
  const request = accessedStore.clear()

  /**
   * Called when the store was cleared successfully.
   *
   * @param {object} event The event object.
   */
  request.onsuccess = (event) => {
    console.log('Store was cleared successfully: ', event)
  }

  /**
   * Called when the store is not cleared successfully.
   *
   * @param {object} event The event object.
   */
  request.onerror = (event) => {
    console.error('Failed clearing store: ', event.target.errorCode)
  }
}

/// //////////////////////////
//  ADDING EVENT LISTENERS  //
/// //////////////////////////
document.addEventListener('createNewAppInstance', ({ detail: { applicationName } }) => {
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
    composed: true
  }))
})

document.addEventListener('deleteAppInstance', (event) => {
  const applicationIndex = applicationArray.indexOf(event.detail.applicationName)

  // Remove the specific application instance from the array.
  if (applicationIndex > -1) {
    applicationArray.splice(applicationIndex, 1)
  }

  event.detail.applicationName.remove()
  translationPositionY += 2
  translationPositionX += 2
})
