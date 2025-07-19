// Handles the in-game date
import { player, adjustResource } from './player.js';
import common from './common.js';
import { updateResources } from './resources.js';
import { updateResearchProgress } from './research.js';

let gameInterval = null;
let lastTickTime = 0;
let accumulatedTime = 0;

function advanceGameTime() {
    if (common.getIsPaused()) {
        return;
    }

    const now = performance.now();
    let deltaTime = now - lastTickTime;

    lastTickTime = now;

    accumulatedTime += deltaTime;

    while (accumulatedTime >= common.dayInMilliseconds) {
        adjustResource('day', 1);
        updateDate();
        if (player.selectedResearchID) {
            updateResearchProgress();
        }
        else {
            stopClock();
        }
        updateResources();
        accumulatedTime -= common.dayInMilliseconds;
    }
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
        if (common.getIsPaused()) {
            common.unpauseGame();
        }
        startClock();
    } 
    else {
        if (!common.getIsPaused()) {
            common.pauseGame(); 
        }
        stopClock();
    }
}

export function updateDate() {
    const dateElement = document.getElementById("date");
    dateElement.innerHTML = calculateGameDate(player.day);
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