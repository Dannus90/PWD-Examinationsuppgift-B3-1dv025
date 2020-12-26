if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const { scope } = await navigator.serviceWorker.register('../../public/sw.js')

      console.log(`ServiceWorker registration succeeded with scope: ${scope}`)
    } catch (err) {
      console.error(`Service worker registration failed: ${err}`)
    }
  })
}
