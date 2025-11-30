// cycle-timer.js
(function () {
    function updateCycleTimer() {
        // Calculate current Vana time in seconds (including fractional seconds)
        const nowMs = Date.now();
        const totalVanaSecFrac = ((nowMs - Date.UTC(2023, 2, 8, 15, 0, 0)) / 1000) * 25;
        const secIntoDayFrac = ((totalVanaSecFrac % 86400) + 86400) % 86400;
        const vanaHour = Math.floor(secIntoDayFrac / 3600);
        const vanaMin = Math.floor((secIntoDayFrac % 3600) / 60);
        const vanaSec = Math.floor(secIntoDayFrac % 60);
        const totalVanaSec = vanaHour * 3600 + vanaMin * 60 + vanaSec;
        let nextCycleVanaSec = 0;
        let cycleType = '';
        let nextCycle = '';
        let vanaMinsToNextCycle = 0;
        let cycleDisplay = '';
        if (vanaHour >= 6 && vanaHour < 18) {
            nextCycleVanaSec = 18 * 3600;
            cycleType = 'Day';
            nextCycle = 'Night';
            cycleDisplay = 'Day';
        } else if (vanaHour >= 18 && vanaHour < 20) {
            nextCycleVanaSec = 20 * 3600;
            cycleType = 'Night';
            nextCycle = 'Undead';
            cycleDisplay = 'Night';
        } else if (vanaHour >= 20 || vanaHour < 4) {
            if (vanaHour >= 20) {
                nextCycleVanaSec = (24 + 4) * 3600; // 4:00 next day
            } else {
                nextCycleVanaSec = 4 * 3600;
            }
            cycleType = 'Undead';
            nextCycle = 'Night';
            cycleDisplay = 'Night (Undead)';
        } else {
            nextCycleVanaSec = 6 * 3600;
            cycleType = 'Night';
            nextCycle = 'Day';
            cycleDisplay = 'Night';
        }
        // Calculate Vana seconds to next cycle
        let vanaSecsToNextCycle = (nextCycleVanaSec - totalVanaSec);
        if (vanaSecsToNextCycle <= 0) vanaSecsToNextCycle += 86400; // wrap to next day
        // Convert Vana seconds to Earth milliseconds
        let earthMsToNextCycle = vanaSecsToNextCycle * 1000 / 25;
        let earthSecsToNextCycle = Math.max(0, Math.round(earthMsToNextCycle / 1000));
        let earthMM = String(Math.floor(earthSecsToNextCycle / 60)).padStart(2, '0');
        let earthSS = String(earthSecsToNextCycle % 60).padStart(2, '0');
        let nextCycleStr = `${nextCycle} in ${earthMM}:${earthSS}`;
        document.getElementById('cycle-status').innerHTML = `<span>${nextCycleStr}</span><br><span class='cycle-type-small'>${cycleDisplay}</span>`;

        // Format Vana time
        const vanaTimeStr = `${vanaHour.toString().padStart(2, '0')}:${vanaMin.toString().padStart(2, '0')}`;
        document.getElementById('cycle-vana-time').textContent = vanaTimeStr;

        // Calculate time until next Undead start (Earth seconds)
        let nextUndeadStartVanaSec;
        if (cycleType === 'Undead') {
            // If in Undead, next Undead starts after current ends (at 4:00, then next 20:00)
            let endVanaSec = vanaHour < 4 ? 4 * 3600 : (24 + 4) * 3600;
            let vanaSecsToEnd = (endVanaSec - totalVanaSec);
            if (vanaSecsToEnd <= 0) vanaSecsToEnd += 86400;
            // After Undead ends, next Undead starts at 20:00
            let nextStartVanaSec = ((endVanaSec % 86400) < (20 * 3600)) ? 20 * 3600 : (20 + 24) * 3600;
            let vanaSecsFromEndToNextStart = (nextStartVanaSec - (endVanaSec % 86400));
            if (vanaSecsFromEndToNextStart <= 0) vanaSecsFromEndToNextStart += 86400;
            nextUndeadStartVanaSec = vanaSecsToEnd + vanaSecsFromEndToNextStart;
        } else {
            // If not in Undead, time until next Undead starts (at 20:00)
            let nextStartVanaSec = vanaHour < 20 ? 20 * 3600 : (20 + 24) * 3600;
            let vanaSecsToNextStart = (nextStartVanaSec - totalVanaSec);
            if (vanaSecsToNextStart <= 0) vanaSecsToNextStart += 86400;
            nextUndeadStartVanaSec = vanaSecsToNextStart;
        }
        // Convert Vana seconds to Earth seconds
        let earthSecsToNextUndead = Math.max(0, Math.round(nextUndeadStartVanaSec * 1000 / 25 / 1000));
        let undeadStartMM = String(Math.floor(earthSecsToNextUndead / 60)).padStart(2, '0');
        let undeadStartSS = String(earthSecsToNextUndead % 60).padStart(2, '0');
        document.getElementById('cycle-undead-countdown').textContent = `${undeadStartMM}:${undeadStartSS}`;

        // Calculate time until next Undead ends
        let undeadEndEarthSecs = 0;
        if (cycleType === 'Undead') {
            // If in Undead, time until current Undead ends
            let endVanaSec = vanaHour < 4 ? 4 * 3600 : (24 + 4) * 3600;
            let vanaSecsToEnd = (endVanaSec - totalVanaSec);
            if (vanaSecsToEnd <= 0) vanaSecsToEnd += 86400;
            undeadEndEarthSecs = Math.max(0, Math.round(vanaSecsToEnd * 1000 / 25 / 1000));
        } else {
            // If not in Undead, time until next Undead starts + duration of Undead (8 Vana hours)
            let vanaSecsUndeadDuration = 8 * 3600;
            undeadEndEarthSecs = earthSecsToNextUndead + Math.round(vanaSecsUndeadDuration * 1000 / 25 / 1000);
        }
        let undeadEndMM = String(Math.floor(undeadEndEarthSecs / 60)).padStart(2, '0');
        let undeadEndSS = String(undeadEndEarthSecs % 60).padStart(2, '0');
        let undeadEndStr = `${undeadEndMM}:${undeadEndSS}`;
        document.getElementById('cycle-undead-end').textContent = undeadEndStr;
    }

    window.updateCycleTimer = updateCycleTimer;
})();
