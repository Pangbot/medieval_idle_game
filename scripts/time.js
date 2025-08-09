// Handles the in-game date and AFK progress
import { player, adjustResource, thresholdReached } from "./player.js";
import { updateResources } from "./resources.js";
import { updateResearchProgress } from "./research.js";
import { updateTaskProgress } from "./tasks.js";
import common from "./common.js";
import { updateAnimations } from "./animations.js";
import { unselectCurrentActions } from "./buttons.js";
import { updateJournal } from "./journal.js";

let gameInterval = null;
let lastTickTime = performance.now();
export let dayProgress = 0;
let tabLastVisibleTime = performance.now();
let remainingRes = 0;
let remainingTask = 0;
let extraTime = 0;

export function getDayProgress() {
    console.log(`Day progress is: ${dayProgress}/${common.dayInMilliseconds}.`);
}

function advanceGameTime() {
    if (document.hidden) {
        return;
    }

    if (!(player.selectedResearchID) || !(player.selectedTaskID)) {
        stopClock();
        return
    }

    const now = performance.now();
    let deltaTime = now - lastTickTime;
    lastTickTime = now;

    if (extraTime > 0) { // Only comes from offline time for short time periods
        deltaTime += extraTime;
        extraTime = 0;
    }

    dayProgress += deltaTime;

    const currentResearch = common.researchMap.get(player.selectedResearchID);
    const currentTask = common.taskMap.get(player.selectedTaskID);

    // Check if either or both will need to reset, add corresponding progresses
    if (currentResearch.workProgress + deltaTime >= common.dayInMilliseconds && currentTask.workProgress + deltaTime >= common.dayInMilliseconds) {
        // Both hit end of bar
        if (currentResearch.progress === currentResearch.daysToComplete - 1 && 
            currentTask.progress === currentTask.daysToComplete - 1) 
        { // Both will complete
            currentResearch.workProgress = 0;
            currentTask.workProgress = 0;
        }
        else if (currentResearch.progress === currentResearch.daysToComplete - 1 && 
                 currentTask.progress !== currentTask.daysToComplete - 1) 
        { // Only research will complete
            currentResearch.workProgress = 0;
            currentTask.workProgress += remainingRes;
            dayProgress += remainingRes - deltaTime; // dayProgress correction

            if (currentTask.workProgress >= common.dayInMilliseconds) {
                currentTask.workProgress -= common.dayInMilliseconds;
            }
        }
        else if (currentResearch.progress !== currentResearch.daysToComplete - 1 && 
                 currentTask.progress === currentTask.daysToComplete - 1) 
        { // Only task will complete
            currentResearch.workProgress += remainingTask;
            dayProgress += remainingTask - deltaTime; // dayProgress correction

            if (currentResearch.workProgress >= common.dayInMilliseconds) {
                currentResearch.workProgress -= common.dayInMilliseconds;
            }
            currentTask.workProgress = 0;
        }
        else { // Neither will complete
            currentResearch.workProgress += deltaTime - common.dayInMilliseconds;
            currentTask.workProgress += deltaTime - common.dayInMilliseconds;
        }
        updateResearchProgress();
        updateTaskProgress();
        updateResources();
        // Check if either button disabled after finishing run
        if (!(player.selectedResearchID)) {
            currentTask.workProgress -= currentResearch.workProgress;
            dayProgress -= currentResearch.workProgress; // dayProgress correction
            currentResearch.workProgress = 0;
        }

        if (!(player.selectedTaskID)) {
            currentResearch.workProgress -= currentTask.workProgress;
            dayProgress -= currentTask.workProgress; // dayProgress correction
            currentTask.workProgress = 0;
        }
    }
    else if (currentResearch.workProgress + deltaTime >= common.dayInMilliseconds && currentTask.workProgress + deltaTime < common.dayInMilliseconds) {
        // currentResearch hits end of bar, currentTask doesn't
        if (currentResearch.progress === currentResearch.daysToComplete - 1) {
            currentResearch.workProgress = 0;
            currentTask.workProgress += remainingRes;
            dayProgress += remainingRes - deltaTime; // dayProgress correction

            if (currentTask.workProgress >= common.dayInMilliseconds) {
                currentTask.workProgress -= common.dayInMilliseconds;
            }
        }
        else {
            currentResearch.workProgress += deltaTime - common.dayInMilliseconds;
            currentTask.workProgress += deltaTime;
        }
        updateResearchProgress();
        updateResources();
        // Check if research button disabled after finishing run
        if (!(player.selectedResearchID)) {
            currentTask.workProgress -= currentResearch.workProgress;
            dayProgress -= currentResearch.workProgress; // dayProgress correction
            currentResearch.workProgress = 0;
        }
    }
    else if (currentResearch.workProgress + deltaTime < common.dayInMilliseconds && currentTask.workProgress + deltaTime >= common.dayInMilliseconds) {
        // currentTask hits end of bar, currentResearch doesn't
        if (currentTask.progress === currentTask.daysToComplete - 1) {
            currentTask.workProgress = 0;
            currentResearch.workProgress += remainingTask;
            dayProgress += remainingTask - deltaTime; // dayProgress correction

            if (currentResearch.workProgress >= common.dayInMilliseconds) {
                currentResearch.workProgress -= common.dayInMilliseconds;
            }
        }
        else {
            currentResearch.workProgress += deltaTime;
            currentTask.workProgress += deltaTime - common.dayInMilliseconds;
        }
        updateTaskProgress();
        updateResources();
        // Check if task button disabled after finishing run
        if (!(player.selectedTaskID)) {
            currentResearch.workProgress -= currentTask.workProgress;
            dayProgress -= currentTask.workProgress; // dayProgress correction
            currentTask.workProgress = 0;
        }
    }
    else {
        // Neither will reach end of bar
        currentResearch.workProgress += deltaTime;
        currentTask.workProgress += deltaTime;
    }

    // Run threshold logic
    if (common.savedSettings.thresholdAlwaysOn && thresholdReached()) {
        // Remove the leftover progress from an action that should not have run again
        const correction = Math.min(currentResearch.workProgress, currentTask.workProgress, dayProgress);
        currentResearch.workProgress -= correction;
        currentTask.workProgress -= correction;
        dayProgress -= correction;
        console.log(`Progresses: ${dayProgress}, ${currentResearch.workProgress}, ${currentTask.workProgress}.`);
        updateAnimations(currentResearch, currentTask);
        unselectCurrentActions();
        stopClock();
    }

    while (dayProgress >= common.dayInMilliseconds) {
        adjustResource("day", 1);
        updateDate(dayProgress);
        updateResources(); // In case there are effects to resources not caused directly from actions
        updateJournal();
        dayProgress -= common.dayInMilliseconds;
    }

    // Calculate remaining time for next loop
    remainingRes = common.dayInMilliseconds - currentResearch.workProgress;
    remainingTask = common.dayInMilliseconds - currentTask.workProgress;

    updateAnimations(currentResearch, currentTask);
}

function startClock() {
    if (gameInterval === null) {
        lastTickTime = performance.now();
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

export function stopClock() {
    if (gameInterval !== null) {
        cancelAnimationFrame(gameInterval);
        gameInterval = null;
    }
}

function gameLoop() {
    advanceGameTime();
    if (gameInterval !== null) {
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

export function restartClockCheck() {
    if (player.selectedResearchID && player.selectedTaskID) {
        startClock();
    } 
}

document.addEventListener("visibilitychange", () => {
    let visibilityChangeTime = performance.now();
    if (document.hidden) {
        tabLastVisibleTime = visibilityChangeTime;
        stopClock();

    } else {
        if (player.selectedResearchID !== null && player.selectedTaskID !== null) {
            calculateOfflineProgress();
            lastTickTime = performance.now();
            restartClockCheck();
        }
    }
});

function calculateOfflineProgress(now = null) {
    if (!now) {
        now = performance.now(); // Currently use performance.now() for invisible tab time, Date.now() for offline time :/ 
    }
    const offlineDuration = now - tabLastVisibleTime;
    console.log(`Simulating ${offlineDuration}ms.`)

    if (offlineDuration < common.dayInMilliseconds) {
        extraTime = offlineDuration;
        return; // Let advanceGameTime() handle it
    }

    let timeSimulated = 0;
    let currentResearch = common.researchMap.get(player.selectedResearchID);
    let currentTask = common.taskMap.get(player.selectedTaskID);

    // Simulate offline time
    while (timeSimulated < offlineDuration) {

        let remainingDayProgress = common.dayInMilliseconds - dayProgress;
        let remainingResProgress = common.dayInMilliseconds - currentResearch.workProgress;
        let remainingTaskProgress = common.dayInMilliseconds - currentTask.workProgress;

        // Get lowest remaining time chunk to finish running action or day
        let timeToNextEvent = Math.min(remainingDayProgress, remainingResProgress, remainingTaskProgress);

        // If a completion is pending and less than a day, that's the next event
        if (currentResearch.progress === currentResearch.daysToComplete - 1 && remainingResProgress < common.dayInMilliseconds) {
            timeToNextEvent = Math.min(timeToNextEvent, remainingResProgress);
        }
        if (currentTask.progress === currentTask.daysToComplete - 1 && remainingTaskProgress < common.dayInMilliseconds) {
            timeToNextEvent = Math.min(timeToNextEvent, remainingTaskProgress);
        }

        // Clamp the time to the remaining offline duration
        const timeToProgress = Math.min(timeToNextEvent, offlineDuration - timeSimulated);

        dayProgress += timeToProgress;
        currentResearch.workProgress += timeToProgress;
        currentTask.workProgress += timeToProgress;
        timeSimulated += timeToProgress;

        // Check which ones are >= common.dayInMilliseconds (bearing in mind it could be 1, 2, or all 3)
        if (dayProgress >= common.dayInMilliseconds) {
            dayProgress -= common.dayInMilliseconds;
            adjustResource("day", 1);
            updateDate(dayProgress);
            remainingDayProgress = common.dayInMilliseconds - dayProgress;
        }

        if (currentResearch.workProgress >= common.dayInMilliseconds) {
            currentResearch.workProgress -= common.dayInMilliseconds;
            updateResearchProgress();
        }

        if (currentTask.workProgress >= common.dayInMilliseconds) {
            currentTask.workProgress -= common.dayInMilliseconds;
            updateTaskProgress();
        }

        updateResources();

        // End loop if threshold reached
        if (thresholdReached()) {
            updateAnimations(currentResearch, currentTask);
            unselectCurrentActions();
            stopClock();
            timeSimulated = offlineDuration;
        }

        // End loop if an action is unselected
        if (!(player.selectedResearchID) || !(player.selectedTaskID)) {
            timeSimulated = offlineDuration;
        }
    }

    updateAnimations(currentResearch, currentTask);
}

export function updateDate(progress = 0) {
    const dateElement = document.getElementById("date");
    const dayResource = player.resources.find(resource => resource.name === "day");
    dateElement.innerHTML = calculateGameDate(dayResource.value);
    dayProgress = progress;
}

function calculateGameDate(dayNumber) {
    const startDate = new Date("1500-04-02T00:00:00Z");
    const targetDate = new Date(startDate.getTime());
    targetDate.setDate(startDate.getDate() + dayNumber);

    const dayOfMonth = targetDate.getDate();
    const month = targetDate.toLocaleDateString("en-UK", { month: "long" });
    const year = targetDate.getFullYear();

    return `${dayOfMonth}<sup>${getOrdinalSuffix(dayOfMonth)}</sup> ${month}, ${year}`;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export function resetDayProgress() {
    dayProgress = 0;
}

// These functions are for loading the game at a later date:

export function addOfflineTime(prevTimestamp) { // Only to be called on loading the tab with previous save info
    console.log(`Selected: ${player.selectedResearchID}, ${player.selectedTaskID}`);
    if (player.selectedResearchID !== null && player.selectedTaskID !== null) {
        tabLastVisibleTime = prevTimestamp;
        calculateOfflineProgress(Date.now());
        lastTickTime = performance.now();
    }
}

export async function getTrustedTimeOffset() {
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch("https://worldtimeapi.org/api/timezone/Europe/London");
            
            if (response.ok) {
                const data = await response.json();
                const serverTime = new Date(data.datetime).getTime();
                const localTime = Date.now();
                return serverTime - localTime;
            }
            
            console.warn(`Attempt ${i + 1} failed with HTTP status: ${response.status}`);
            
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed: ${error.message}`);
        }

        if (i < 2) {
            await asyncDelay(500); 
        }
    }

    common.notify(`Could not fetch the time. :( Try refreshing the page. If this keeps happening, try disabling your adblocker. There are no ads here!`);
    return 0;
}

function asyncDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}