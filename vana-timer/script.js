// script.js
(() => {
    // — Constants —
    const EPOCH_MS = Date.UTC(2023, 2, 8, 15, 0, 0); // JST Mar 9 00:00
    const TICK_MS = 3456 * 1000;                   // 57m36s in ms
    // const VANA_DAY_NAMES = [
    //     'Firesday', 'Earthsday', 'Watersday', 'Windsday',
    //     'Iceday', 'Lightningday', 'Lightsday', 'Darksday'
    // ];

    // — 1) In‐game tick helper —
    function computeLeftMs(nowMs) {
        let sinceLast = (nowMs - EPOCH_MS) % TICK_MS;
        if (sinceLast < 0) sinceLast += TICK_MS;
        return TICK_MS - sinceLast;
    }

    // — 2) Current Vana time HH:MM @25× speed —
    function getCurrentVanaHM(nowMs) {
        const totalVanaSec = ((nowMs - EPOCH_MS) / 1000) * 25;
        const secIntoDay = ((totalVanaSec % 86400) + 86400) % 86400;
        return [
            Math.floor(secIntoDay / 3600),
            Math.floor((secIntoDay % 3600) / 60)
        ];
    }

    // — 3) Current Vana-day name every 3456s —
    // function getCurrentVanaDay(nowMs) {
    //     const daysSince = Math.floor((nowMs - EPOCH_MS) / TICK_MS);
    //     const idx = ((daysSince % 8) + 8) % 8;
    //     return VANA_DAY_NAMES[idx];
    // }

    // — 4) Next daily Tokyo midnight (00:00 JST) in UTC-ms —
    function getNextTokyoMidnightMs(nowMs) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric', month: 'numeric', day: 'numeric'
        }).formatToParts(new Date(nowMs));
        const year = +parts.find(p => p.type === 'year').value;
        const month = +parts.find(p => p.type === 'month').value;
        const day = +parts.find(p => p.type === 'day').value;
        // Tokyo-local midnight next day → UTC-ms:
        const utcMidnight = Date.UTC(year, month - 1, day + 1, 0, 0, 0);
        return utcMidnight - 9 * 3600 * 1000; // JST = UTC+9
    }

    // — 5) Next Mon 00:00 JST in UTC-ms —
    function getNextMondayMidnightTokyoMs(nowMs) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Tokyo',
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(new Date(nowMs));
        const year = +parts.find(p => p.type === 'year').value;
        const month = +parts.find(p => p.type === 'month').value;
        const day = +parts.find(p => p.type === 'day').value;
        const weekday = parts.find(p => p.type === 'weekday').value;
        const dowMap = {
            Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
            Thursday: 4, Friday: 5, Saturday: 6
        };
        let delta = (1 - dowMap[weekday] + 7) % 7;
        if (delta === 0) delta = 7; // if today is Monday, pick next
        const utcMid = Date.UTC(year, month - 1, day + delta, 0, 0, 0);
        return utcMid - 9 * 3600 * 1000;
    }

    // — 6) updateAll pushes every field —
    function updateAll() {
        const nowMs = Date.now();
        const leftMsTick = computeLeftMs(nowMs);

        // a) In-game countdown mm:ss
        const totalSec = Math.ceil(leftMsTick / 1000);
        const cMin = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const cSec = String(totalSec % 60).padStart(2, '0');
        document.getElementById('countdown').textContent = `${cMin}:${cSec}`;

        // b) Current Vana Time HH:MM
        const [vh, vm] = getCurrentVanaHM(nowMs)
            .map(n => String(n).padStart(2, '0'));
        document.getElementById('vana-time').textContent = `${vh}:${vm}`;

        // c) Current Vana Day
        // document.getElementById('vana-day').textContent = getCurrentVanaDay(nowMs);

        // d) Next Vana-Day Earth timestamp
        const nextVanaDate = new Date(nowMs + leftMsTick);
        let nvH = nextVanaDate.getHours();
        const nvAMPM = nvH >= 12 ? 'PM' : 'AM';
        nvH = nvH % 12 || 12;
        const nvMins = String(nextVanaDate.getMinutes()).padStart(2, '0');
        const nvSecs = String(nextVanaDate.getSeconds()).padStart(2, '0');
        const nvMon = nextVanaDate.getMonth() + 1;
        const nvDay = nextVanaDate.getDate();
        document.getElementById('next-vana-datetime').textContent =
            `${nvMon}/${nvDay} ${nvH}:${nvMins}:${nvSecs} ${nvAMPM}`;

        // e) Time until next **daily** Tokyo midnight HH:MM:SS
        const tokMs = getNextTokyoMidnightMs(nowMs);
        const diffTok = Math.max(0, tokMs - nowMs);
        const dH = String(Math.floor(diffTok / 3600000)).padStart(2, '0');
        const dM = String(Math.floor((diffTok % 3600000) / 60000)).padStart(2, '0');
        const dS = String(Math.floor((diffTok % 60000) / 1000)).padStart(2, '0');
        document.getElementById('tokyo-midnight-countdown').textContent =
            `${dH}:${dM}:${dS}`;

        // f) Time until next **Monday** 00:00 JST (Xd HH:MM:SS)
        const nextMonMs = getNextMondayMidnightTokyoMs(nowMs);
        const diffMon = Math.max(0, nextMonMs - nowMs);
        const daysLeft = Math.floor(diffMon / 86400000);
        const hLeft = Math.floor((diffMon % 86400000) / 3600000);
        const mLeft = Math.floor((diffMon % 3600000) / 60000);
        const sLeft = Math.floor((diffMon % 60000) / 1000);
        const dayStr = daysLeft > 0 ? `${daysLeft}d ` : '';
        const hStr = String(hLeft).padStart(2, '0');
        const mStr = String(mLeft).padStart(2, '0');
        const sStr = String(sLeft).padStart(2, '0');
        document.getElementById('next-reset').textContent =
            `${dayStr}${hStr}:${mStr}:${sStr}`;
    }

window.updateVanaTimer = updateAll;

})();
