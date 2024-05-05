// Limited Time Challenges
const challengePeriod = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
let cPeriodCount;
let nextChallengeTime;
let currentJapanTime;
let challenges;
var DateTime = luxon.DateTime;
var Duration = luxon.Duration;

function populateChallenges() {
    return [
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage" },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids" },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs" },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin" },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana" },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points" },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds" },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards" },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead" },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals" },
        { Name: "Crack Treasure Chests", Description: "Open 10 Treasure Chests" },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans" },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs" },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin" },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana" },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points" },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage" },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts" },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead" },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals" },
        { Name: "Crack Treasure Chests", Description: "Open 10 Treasure Chests" },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans" },
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage" },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids" },
        { Name: "Vanquish Arcana", Description: "Kill 20 Arcana" },
        { Name: "Gain Experience", Description: "Gain 5000 Experience/Limit Points" },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage" },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts" },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds" },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards" },
        { Name: "Crack Treasure Caskets", Description: "Open 10 Treasure Caskets" },
        { Name: "Vanquish Aquans", Description: "Kill 20 Aquans" },
        { Name: "Magic Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Magic Damage" },
        { Name: "Vanquish Plantoids", Description: "Kill 20 Plantoids" },
        { Name: "Vanquish Amorphs", Description: "Kill 20 Amorphs" },
        { Name: "Vanquish Vermin", Description: "Kill 20 Vermin" },
        { Name: "Physical Damage Kills", Description: "Kill 20 Experience Wielding Mobs with Physical Damage" },
        { Name: "Vanquish Beasts", Description: "Kill 20 Beasts" },
        { Name: "Vanquish Birds", Description: "Kill 20 Birds" },
        { Name: "Vanquish Lizards", Description: "Kill 20 Lizards" },
        { Name: "Vanquish Undead", Description: "Kill 20 Undead" },
        { Name: "Spoils (Seals)", Description: "Obtain 3 Beastmen-like Seals" }
    ];
}


/**
 * Finds the next challenge time based on the current time in Japan
 */
function findNextChallengeTime() {
    // Get current time in Japan
    const currentJapanTime = DateTime.local().setZone('Asia/Tokyo');

    // Get the last Sunday
    const lastSunday = currentJapanTime.startOf('week').minus({ days: 1 });

    // Subtract 108 seconds from last Sunday to account for the time difference
    const lastSundayTime = lastSunday.minus({ seconds: 108});

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
challenges = populateChallenges();
findNextChallengeTime();
beginTimer();



