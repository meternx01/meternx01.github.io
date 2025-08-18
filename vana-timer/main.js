// main.js
(() => {
  function tick() {
    window.updateVanaTimer();
    window.updateMobTimer();
  }

  document.addEventListener("DOMContentLoaded", () => {
    tick(); // initial draw
    setInterval(tick, 1000); // one shared timer
  });
  
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
})();
