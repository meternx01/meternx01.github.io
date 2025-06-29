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
  
})();
