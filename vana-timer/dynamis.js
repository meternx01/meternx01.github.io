// dynamis.js
(() => {
  // 1) Configuration: your mob list & period
  const mobList = [
    ["Fly", "Flytrap", "Funguar"],
    ["Sabotender", "Hippogryph", "Sheep"],
    ["Goobbue", "Manticore", "Treant"]
  ];

  const currency = [
      "Byne Bill",
      "Bronzepiece",
      "Whiteshell",
  ]
  const MOB_PERIOD_MS = ((8 / 25) * 3600) * 1000; // 1152s × 1000

  // 2) Compute next wave info in JST
  function computeMobInfo(now = new Date()) {
    const jstOffsetMs = 9 * 3600 * 1000;
    const nowJstMs = now.getTime() + jstOffsetMs;
    const jstDate = new Date(nowJstMs);
    const year = jstDate.getUTCFullYear();
    const month = jstDate.getUTCMonth();
    const day = jstDate.getUTCDate();
    const lastMidJstMs = Date.UTC(year, month, day, 0, 0, 0);
    const elapsedMs = nowJstMs - lastMidJstMs;
    const periodCount = Math.floor(elapsedMs / MOB_PERIOD_MS);
    const nextWaveMs = lastMidJstMs + (periodCount + 1) * MOB_PERIOD_MS;
    const leftMs = nextWaveMs - nowJstMs;
    const mobNamesArr = mobList[periodCount % mobList.length];
    const mobNames = mobNamesArr.join('<br>');
    const currencyType = currency[periodCount % currency.length];
    return { leftMs, mobNames, currencyType  };
  }

  // 3) Render/update function
  function updateMobTimer() {
    const { leftMs, mobNames, currencyType } = computeMobInfo();
    const totalSec = Math.max(0, Math.ceil(leftMs / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');

    document.getElementById('mob-names').innerHTML = mobNames;
    document.getElementById('mob-currency').textContent = currencyType;
    document.getElementById('mob-countdown').textContent = `${mm}:${ss}`;
    if (totalSec <= 60) {
      document.getElementById('mob-countdown').style.color = 'red';
    } else {
      document.getElementById('mob-countdown').style.color = 'black';
    }
  }

  window.updateMobTimer = updateMobTimer;

})();
