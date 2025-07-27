// Handles the in-game date
import { player, adjustResource, changeTask, changeResearch } from './player.js';
import { updateResources } from './resources.js';
import { updateResearchProgress } from './research.js';
import { updateTaskProgress } from './tasks.js';
import common from './common.js';
import { updateAnimations } from './animations.js';

let gameInterval = null;
let lastTickTime = performance.now();
let accumulatedTime = 0;
let tabLastVisibleTime = performance.now();
let remainingRes = 0;
let remainingTask = 0;

function advanceGameTime() {
    if (document.hidden) {
        return;
    }
    const now = performance.now();
    let deltaTime = now - lastTickTime;

    lastTickTime = now;
    accumulatedTime += deltaTime;

    const currentResearch = common.researchMap.get(player.selectedResearchID);
    const currentTask = common.taskMap.get(player.selectedTaskID);

    while (accumulatedTime >= common.dayInMilliseconds) {
        adjustResource('day', 1);
        updateDate();

        if (player.selectedResearchID) {
            updateResearchProgress();
        }
        if (player.selectedTaskID) {
            updateTaskProgress();
        }

        updateResources();
        accumulatedTime -= common.dayInMilliseconds;

        // For whatever reason, some desyncing can happen if a research/task completes (but not both, presumably because it needs to recreate the buttons?)
        // Anyway, this makes sure they stay synced if that happens
        if (!(player.selectedResearchID) || !(player.selectedTaskID)) {
            stopClock();
            if (player.selectedResearchID) {
                currentResearch.workProgress += remainingTask;
                while (currentResearch.workProgress >= common.dayInMilliseconds) {
                    currentResearch.workProgress -= common.dayInMilliseconds;
                }
            }
            else if (player.selectedTaskID) {
                currentTask.workProgress += remainingRes;
                while (currentTask.workProgress >= common.dayInMilliseconds) {
                    currentTask.workProgress -= common.dayInMilliseconds;
                }
            }
            updateAnimations(currentResearch, currentTask);
            return;
        }
    }

    currentResearch.workProgress += deltaTime;
    currentTask.workProgress += deltaTime;

    while (currentResearch.workProgress >= common.dayInMilliseconds) {
        currentResearch.workProgress -= common.dayInMilliseconds;
    }
    while (currentTask.workProgress >= common.dayInMilliseconds) {
        currentTask.workProgress -= common.dayInMilliseconds;
    }

    updateAnimations(currentResearch, currentTask);

    remainingRes = common.dayInMilliseconds - currentResearch.workProgress;
    remainingTask = common.dayInMilliseconds - currentTask.workProgress;
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
    if( player.selectedResearchID && player.selectedTaskID ) {
        startClock();
    } 
}

document.addEventListener('visibilitychange', () => {
    let visibilityChangeTime = performance.now();
    if (document.hidden) {
        tabLastVisibleTime = visibilityChangeTime;
        stopClock();
    } else {
        calculateOfflineProgress();
        lastTickTime = performance.now();
        accumulatedTime = 0;
        restartClockCheck();
    }
});

function calculateOfflineProgress() {
    const now = performance.now();
    const offlineDuration = now - tabLastVisibleTime;

    if (offlineDuration < common.dayInMilliseconds || player.selectedResearchID === null || player.selectedTaskID === null) {
        accumulatedTime = offlineDuration;
        return;
    }

    let daysPassed = Math.floor(offlineDuration / common.dayInMilliseconds);
    let remainingTime = offlineDuration % common.dayInMilliseconds;
    let resultingTaskProgress = 0;
    let resultingResearchProgress = 0;

    let currentResearch = common.researchMap.get(player.selectedResearchID);
    let currentTask = common.taskMap.get(player.selectedTaskID);

    // Simulate offline days
    for (let i = 0; i < daysPassed; i++) {
        if (player.selectedResearchID === null || player.selectedTaskID === null) {
            if (player.selectedResearchID === null) {
                changeResearch(null);
                if (player.selectedTaskID != null) {
                    resultingTaskProgress = common.dayInMilliseconds - currentResearch.workProgress;
                }
            }
            if (player.selectedTaskID === null) {
                changeTask(null)
                if (player.selectedResearchID != null) {
                    resultingResearchProgress = common.dayInMilliseconds - currentTask.workProgress;
                }
            }
            break;
        }
        adjustResource('day', 1);
        updateDate();
        if (player.selectedResearchID) {
            updateResearchProgress();
        }
        if (player.selectedTaskID) {
            updateTaskProgress();
        }
        updateResources();
    }

    currentResearch = common.researchMap.get(player.selectedResearchID);
    currentTask = common.taskMap.get(player.selectedTaskID);

    if (resultingTaskProgress > 0) {
        currentTask.workProgress += resultingTaskProgress;
        if (currentTask.workProgress >= common.dayInMilliseconds) {
            currentTask.workProgress -= common.dayInMilliseconds;
        }
    } else if (resultingResearchProgress > 0) {
        currentResearch.workProgress += resultingResearchProgress;
        if (currentResearch.workProgress >= common.dayInMilliseconds) {
            currentResearch.workProgress -= common.dayInMilliseconds;
        }
    } else {
        if (currentResearch) {
            currentResearch.workProgress += remainingTime;
            if (currentResearch.workProgress > common.dayInMilliseconds) {
                currentResearch.workProgress -= common.dayInMilliseconds;
            }
        }
        if (currentTask) {
            currentTask.workProgress += remainingTime;
            if (currentTask.workProgress > common.dayInMilliseconds) {
                currentTask.workProgress -= common.dayInMilliseconds;
            }
        }
    }

    updateAnimations(currentResearch, currentTask);
}

export function updateDate() {
    const dateElement = document.getElementById("date");
    const dayResource = player.resources.find(resource => resource.name === "day");
    dateElement.innerHTML = calculateGameDate(dayResource.amount);
}

function calculateGameDate(dayNumber) {
    const startDate = new Date('1500-04-02T00:00:00Z');
    const targetDate = new Date(startDate.getTime());
    targetDate.setDate(startDate.getDate() + dayNumber);

    const dayOfMonth = targetDate.getDate();
    const month = targetDate.toLocaleDateString('en-UK', { month: 'long' });
    const year = targetDate.getFullYear();

    return `${dayOfMonth}<sup>${getOrdinalSuffix(dayOfMonth)}</sup> ${month}, ${year}`;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
    }
}