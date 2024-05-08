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
        { Name: "Crack Treasure Coffers", Description: "Open 10 Treasure Coffers", Time: time.plus({ hours: 40 }) },
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


/**
 * Calculate the start time of the challenge period based on the given time.
 * The challenge period is Sunday at 10:00:00 AM JST.
 *
 * @param {DateTime} time - The time to calculate the start time from
 * @return {DateTime} The start time of the challenge period
 */
function startTime(time,adjust) {
    currentJapanTime = time;

    // Find the last Sunday and subtract 108 seconds to get the start time
    const lastSunday = time.startOf('week').minus({ days: 1 });
    if(adjust){
    const lastSundayTime = lastSunday.minus({ seconds: 108 });}

    return lastSundayTime;
}



/**
 * Find the next challenge time based on the current time.
 * The next challenge time is calculated by finding the number of challenge periods that have passed
 * since the last Sunday at 10:00:00 AM JST (UTC+9) and adding one to that number.
 * The result is then modded by the number of challenges to get the next challenge index.
 * The next challenge time is then calculated by adding the number of challenge periods to the start time.
 *
 * The start time is calculated by finding the last Sunday at 10:00:00 AM JST and subtracting 108 seconds.
 *
 * The current and up next challenge names and times are updated in the HTML.
 */
function findNextChallengeTime() {
    const lastSundayTime = startTime(DateTime.local().setZone('Asia/Tokyo'),1);  // Last Sunday at 10:00:00 AM JST

    // Calculate the number of challenge periods that have passed
    const dayDiff = currentJapanTime.diff(lastSundayTime, 'milliseconds');  // Milliseconds since last Sunday
    const cPeriodCount = dayDiff / challengePeriod;  // Number of periods that have passed

    // Find the index of the next challenge
    const nextPeriod = (Math.floor(cPeriodCount) + 1) % challenges.length;  // Next challenge index

    // Set the next challenge time
    nextChallengeTime = lastSundayTime.plus({ milliseconds: ((Math.floor(cPeriodCount) + 1) * challengePeriod) });  // Next challenge time

    // Set the current and up next challenge names
    $("#ChallengeName").text(challenges[Math.floor(cPeriodCount) % challenges.length].Name);  // Current challenge name
    $("#UpNext").text(challenges[nextPeriod].Name);  // Up next challenge name

    // Change the text of id ChallengeNextTime in jquery
    $("#ChallengeNextTime").text(localizeTime(nextChallengeTime));  // Next challenge time

    var challengeTexts = [$("#challenge1"), $("#challenge2"), $("#challenge3")];  // Challenge text elements
    var timeTexts = [$("#times1"), $("#times2"), $("#times3")];  // Time text elements

    for (var i = 1; i <= 3; i++) {
        challengeTexts[i - 1].text(challenges[(nextPeriod + i) % challenges.length].Name);  // Set the challenge name
        timeTexts[i - 1].text(challenges[(nextPeriod + i) % challenges.length].Time.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat('h:mm a') + " - " + challenges[(nextPeriod + i) % challenges.length].Time.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).plus({ hours: 4 }).toFormat('h:mm a'));  // Set the challenge time
    }

}



/**
 * Adjust the input time to the local timezone of the user
 *
 * @param {DateTime} inputTime The time to be localized
 * @returns The localized time in the format of "MM/dd h:mm:ss a"
 */
function localizeTime(inputTime) {
    // Get the timezone of the user from the browser's settings
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Adjust the input time to the user's timezone
    return inputTime.setZone(userTimezone).toFormat('MM/dd h:mm:ss a');
}



/**
 * Begin the timer that updates the time until the next challenge every second
 */
function beginTimer() {
    // Set an interval to call the timerTick function every second
    setInterval(timerTick, 1000);  // Every 1000 milliseconds
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
challenges = populateChallenges(startTime(DateTime.local().setZone('Asia/Tokyo'),false));
findNextChallengeTime();
beginTimer();



