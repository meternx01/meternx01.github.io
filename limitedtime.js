// Limited Time Challenges
const challengePeriod = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
let cPeriodCount;
let nextChallengeTime;
let currentJapanTime;
let challenges;
var DateTime = luxon.DateTime;
var Duration = luxon.Duration;

function populateChallenges(time) {
    return [
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage", Time: time },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids", Time: time.plus({ hours: 4 }) },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs", Time: time.plus({ hours: 8 }) },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin", Time: time.plus({ hours: 12 }) },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana", Time: time.plus({ hours: 16 }) },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points", Time: time.plus({ hours: 20 }) },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds", Time: time.plus({ hours: 24 }) },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards", Time: time.plus({ hours: 28 }) },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead", Time: time.plus({ hours: 32 }) },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals", Time: time.plus({ hours: 36 }) },
        { Name: "Crack Treasure Chests", Description: "Open 10 Treasure Chests", Time: time.plus({ hours: 40 }) },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans", Time: time.plus({ hours: 44 }) },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs", Time: time.plus({ hours: 48 }) },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin", Time: time.plus({ hours: 52 }) },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana", Time: time.plus({ hours: 56 }) },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points", Time: time.plus({ hours: 60 }) },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage", Time: time.plus({ hours: 64 }) },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts", Time: time.plus({ hours: 68 }) },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead", Time: time.plus({ hours: 72 }) },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals", Time: time.plus({ hours: 76 }) },
        { Name: "Crack Treasure Chests", Description: "Open 10 Treasure Chests", Time: time.plus({ hours: 80 }) },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans", Time: time.plus({ hours: 84 }) },
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage", Time: time.plus({ hours: 88 }) },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids", Time: time.plus({ hours: 92 }) },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana", Time: time.plus({ hours: 96 }) },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points", Time: time.plus({ hours: 100 }) },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage", Time: time.plus({ hours: 104 }) },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts", Time: time.plus({ hours: 108 }) },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds", Time: time.plus({ hours: 112 }) },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards", Time: time.plus({ hours: 116 }) },
        { Name: "Crack Treasure Caskets", Description: "Open 10 Treasure Caskets", Time: time.plus({ hours: 120 }) },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans", Time: time.plus({ hours: 124 }) },
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage", Time: time.plus({ hours: 128 }) },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids", Time: time.plus({ hours: 132 }) },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs", Time: time.plus({ hours: 136 }) },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin", Time: time.plus({ hours: 140 }) },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage", Time: time.plus({ hours: 144 }) },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts", Time: time.plus({ hours: 148 }) },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds", Time: time.plus({ hours: 152 }) },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards", Time: time.plus({ hours: 156 }) },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead", Time: time.plus({ hours: 160 }) },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals", Time: time.plus({ hours: 164 }) }
    ];
}


function startTime(time) {
    currentJapanTime = time;
    const lastSunday = time.startOf('week').minus({ days: 1 });
    const lastSundayTime = lastSunday.minus({ seconds: 108 });

    return lastSundayTime;
}


function findNextChallengeTime() {
    const lastSundayTime = startTime(DateTime.local().setZone('Asia/Tokyo'));

    // Calculate the number of periods that have passed
    const dayDiff = currentJapanTime.diff(lastSundayTime, 'milliseconds');
    cPeriodCount = dayDiff / challengePeriod;

    // Find the next challenge period
    const nextPeriod = (Math.floor(cPeriodCount) + 1) % challenges.length;

    // Set the next challenge time
    nextChallengeTime = lastSundayTime.plus({ milliseconds: ((Math.floor(cPeriodCount) + 1) * challengePeriod) });

    // Set the current and up next challenge names
    $("#ChallengeName").text(challenges[Math.floor(cPeriodCount) % challenges.length].Name);
    $("#UpNext").text(challenges[nextPeriod].Name);

    // Change the text of id ChallengeNextTime in jquery
    $("#ChallengeNextTime").text(localizeTime(nextChallengeTime));

    var challengeTexts = [$("#challenge1"), $("#challenge2"), $("#challenge3")];
    var timeTexts = [$("#times1"), $("#times2"), $("#times3")];

    for (var i = 1; i <= 3; i++) {
        challengeTexts[i - 1].text(challenges[(nextPeriod + i) % challenges.length].Name);
        timeTexts[i - 1].text(challenges[(nextPeriod + i) % challenges.length].Time.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat('h:mm:ss a') + " - " + challenges[(nextPeriod + i) % challenges.length].Time.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).plus({ hours: 4 }).toFormat('h:mm:ss a'));
    }

}


function localizeTime(inputTime) {
    // Adjust to the local timezone of the user
    return inputTime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat('MM/dd h:mm:ss a');
}


function beginTimer() {
    setInterval(timerTick, 1000);
}

/**
 * Called every second to update the time until the next challenge.
 */
function timerTick() {
    // Get current time in Japan
    currentJapanTime = DateTime.local().setZone('Asia/Tokyo');

    // If the next challenge time has passed, find the next challenge
    if (nextChallengeTime.diff(currentJapanTime, 'milliseconds') < 0) {
        findNextChallengeTime();
    }

    // Calculate the time difference between now and the next challenge
    let timeDiff = nextChallengeTime.diff(currentJapanTime, 'milliseconds');

    // If the time until the next challenge is less than 1 hour,
    // format the time as minutes:seconds
    if (timeDiff < 3600 * 1000) {
        var ctr = Duration.fromMillis(timeDiff).toFormat('mm:ss');
        $("#ChallengeTimeRemaining").text(ctr);
    } else {
        // Otherwise, format the time as hours:minutes:seconds
        var ctr = Duration.fromMillis(timeDiff).toFormat('h:mm:ss');
        $("#ChallengeTimeRemaining").text(ctr);
    }
}

// Initialize
challenges = populateChallenges(startTime(DateTime.local().setZone('Asia/Tokyo')));
findNextChallengeTime();
beginTimer();



