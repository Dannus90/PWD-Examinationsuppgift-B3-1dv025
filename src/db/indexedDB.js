import '../components/dab-memory-game/dab-high-score/index.js'

// --- VARIABLES RELATED TO INDEXEDDB --- //
const dbName = 'PWDApplicationDatabase'
const dbVersion = 1
export const smallMemoryDbStore = 'SmallMemoryStore'
export const mediumMemoryDbStore = 'MediumMemoryStore'
export const largeMemoryDbStore = 'LargeMemoryStore'
const nickNameIndex = 'nickname'
const scoreIndex = 'score'
const timeIndex = 'time'
const recentMemoryNameDbStore = 'MemoryNicknameStore'
const recentMemoryNameIndex = 'nickname'
const recentChatNameDbStore = 'ChatNicknameStore'
const recentChatNameIndex = 'nickname'

// --- INITIALIZE VARIABLE FOR DB --- //
export let db

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

    const smallMemoryStoreInstance = db.transaction(smallMemoryDbStore, 'readonly').objectStore(smallMemoryDbStore)
    const mediumMemoryStoreInstance = db.transaction(mediumMemoryDbStore, 'readonly').objectStore(mediumMemoryDbStore)
    const largeMemoryStoreInstance = db.transaction(largeMemoryDbStore, 'readonly').objectStore(largeMemoryDbStore)

    /**
     * Gets all current data in the small memory store.
     * Sends the data to the highscore component.
     *
     * @param {object} e The event object.
     */
    smallMemoryStoreInstance.getAll().onsuccess = async (e) => {
      const memoryData = await e.target.result
      highScore.smallHighScore = memoryData
    }

    /**
     * Gets all current data in the medium memory store.
     * Sends the data to the highscore component.
     *
     * @param {object} e The event object.
     */
    mediumMemoryStoreInstance.getAll().onsuccess = async (e) => {
      const memoryData = await e.target.result
      highScore.mediumHighScore = memoryData
    }

    /**
     * Gets all current data in the large memory store.
     * Sends the data to the highscore component.
     *
     * @param {object} e The event object.
     */
    largeMemoryStoreInstance.getAll().onsuccess = async (e) => {
      const memoryData = await e.target.result
      highScore.largeHighScore = memoryData
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

    // Setting up store for small memory game.
    const smallMemoryObjectStore = db.createObjectStore(smallMemoryDbStore, { keyPath: 'id', autoIncrement: true })
    smallMemoryObjectStore.createIndex(nickNameIndex, nickNameIndex, { unique: false })
    smallMemoryObjectStore.createIndex(scoreIndex, scoreIndex, { unique: false })
    smallMemoryObjectStore.createIndex(timeIndex, timeIndex, { unique: false })

    // Setting up store for medium memory game.
    const mediumMemoryObjectStore = db.createObjectStore(mediumMemoryDbStore, { keyPath: 'id', autoIncrement: true })
    mediumMemoryObjectStore.createIndex(nickNameIndex, nickNameIndex, { unique: false })
    mediumMemoryObjectStore.createIndex(scoreIndex, scoreIndex, { unique: false })
    mediumMemoryObjectStore.createIndex(timeIndex, timeIndex, { unique: false })

    // Setting up store for large memory game.
    const largeMemoryObjectStore = db.createObjectStore(largeMemoryDbStore, { keyPath: 'id', autoIncrement: true })
    largeMemoryObjectStore.createIndex(nickNameIndex, nickNameIndex, { unique: false })
    largeMemoryObjectStore.createIndex(scoreIndex, scoreIndex, { unique: false })
    largeMemoryObjectStore.createIndex(timeIndex, timeIndex, { unique: false })

    // Setting up store for memory nickname store.
    const memoryNicknameDbStore = await db.createObjectStore(recentMemoryNameDbStore, { keyPath: 'id', autoIncrement: true })
    memoryNicknameDbStore.createIndex(recentMemoryNameIndex, recentMemoryNameIndex, { unique: false })

    // Setting up store for memory nickname store.
    const chatNicknameDbStore = await db.createObjectStore(recentChatNameDbStore, { keyPath: 'id', autoIncrement: true })
    chatNicknameDbStore.createIndex(recentChatNameIndex, recentChatNameIndex, { unique: false })

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
      time: 25
    },
    {
      nickname: 'MsMemory',
      numberOfTries: 11,
      time: 30
    },
    {
      nickname: 'LordMemory',
      numberOfTries: 13,
      time: 32
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
     * Seeding the memory object stores with players.
     * Has to be done in this way to successfully seed all storages.
     *
     * @param {object} e The event object.
     */
    largeMemoryObjectStore.transaction.oncomplete = async (e) => {
      const accessedLargeMemoryStore = await db.transaction(largeMemoryDbStore, 'readwrite').objectStore(largeMemoryDbStore)
      seedDataMemoryLarge.forEach(async (seedPlayer) => {
        await accessedLargeMemoryStore.add(seedPlayer)
      })

      const accessedMediumMemoryStore = await db.transaction(mediumMemoryDbStore, 'readwrite').objectStore(mediumMemoryDbStore)
      seedDataMemoryMedium.forEach(async (seedPlayer) => {
        await accessedMediumMemoryStore.add(seedPlayer)
      })

      const accessedSmallMemoryStore = await db.transaction(smallMemoryDbStore, 'readwrite').objectStore(smallMemoryDbStore)
      seedDataMemorySmall.forEach(async (seedPlayer) => {
        await accessedSmallMemoryStore.add(seedPlayer)
      })
    }
  }
}
)()

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
export const getStore = (storeName, method) => {
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
export const clearStore = (storeName, method) => {
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

/// /////////////////////////
//      DOM SELECTORS      //
/// /////////////////////////

const highScore = document.querySelectorAll('dab-high-score')
