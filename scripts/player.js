// Handles the player's resources and stats

import { restartClockCheck } from "./time.js";

let player = {
    age: null,
    day: 0,
    selectedTaskID: null,
    selectedResearchID: null,
    researched: new Set(),
    money: 0,
    health: 100,
    motivation: 100,
    DBH: 0
};

function loadPlayer(data) {
    player = data
}

function adjustResource(resource, amount) { 
    if (resource in player) {
        player[resource] += amount;
    }
    else {
        console.log(`Resource ${resource} not found in player struct (${player}).`)
    }
}

function changeTask(taskID) {
    if (taskID === player.selectedTaskID) {
        player.selectedTaskID = null;
    }
    else {
        player.selectedTaskID = taskID;
    }
    restartClockCheck();
}

function changeResearch(researchID) {
    if (researchID === player.selectedResearchID) {
        player.selectedResearchID = null;
    }
    else {
        player.selectedResearchID = researchID;
    }
    restartClockCheck();
}

export { player, loadPlayer, adjustResource, changeTask, changeResearch };