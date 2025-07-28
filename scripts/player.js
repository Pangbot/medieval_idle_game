// Handles the player's resources and stats

import { restartClockCheck, stopClock } from "./time.js";
import { updateTabButtons, unselectCurrentActions } from "./buttons.js";
import common from "./common.js";

let thresholdTriggeredResources = [];

export let player = {
    age: null,
    selectedTaskID: null,
    selectedResearchID: null,
    completed: new Set(),
    resources: [
        { name: "day", amount: 0 },
        { name: "money", amount: 0 },
        { name: "health", amount: 100 },
        { name: "motivation", amount: 100 },
        { name: "DBH", amount: 0 }
    ],
};

export function loadPlayer(data) {
    player = data
}

export function adjustResource(resourceName, amount) {
    const resourceObj = player.resources.find(resource => resource.name === resourceName);

    if (resourceObj) {
        resourceObj.amount += amount;

        if (resourceName === "health" || resourceName === "motivation") {
            resourceObj.amount = Math.max(0, Math.min(resourceObj.amount, 100));
        }
        else if (resourceName === "DBH") {
            resourceObj.amount = Math.max(0, Math.min(resourceObj.amount, 1));
        }

        if (common.savedSettings.thresholdAlwaysOn) {
            if (resourceName === "health" && thresholdTriggeredResources.includes("health") && resourceObj.amount >= 2*common.savedSettings.threshold) {
                thresholdReset(resourceName);
            } else if (resourceName === "motivation" && thresholdTriggeredResources.includes("motivation") &&  resourceObj.amount >= 2*common.savedSettings.threshold) {
                thresholdReset(resourceName);
            } else if (resourceName === "DBH" && thresholdTriggeredResources.includes("DBH") && resourceObj.amount <= (100 - (2*common.savedSettings.threshold)) / 100) {
                thresholdReset(resourceName);
            }
        }

    } else {
        newResource(resourceName, amount);
    }
}

function newResource(resource, amount) {
    player.resources.push({name: resource, amount: amount});
}

export function changeTask(taskID) {
    if (taskID === player.selectedTaskID) {
        player.selectedTaskID = null;
    }
    else {
        player.selectedTaskID = taskID;
    }
    updateTabButtons("taskTabs");
    restartClockCheck();
}

export function changeResearch(researchID) {
    if (researchID === player.selectedResearchID) {
        player.selectedResearchID = null;
    }
    else {
        player.selectedResearchID = researchID;
    }
    updateTabButtons("researchTabs");
    restartClockCheck();
}

export function thresholdReached() {
    let threshold = common.savedSettings.threshold;
    let thresholdTriggerLength = thresholdTriggeredResources.length;

    let health = player.resources.find(resource => resource.name === "health").amount;
    let motivation = player.resources.find(resource => resource.name === "motivation").amount;
    let DBH = player.resources.find(resource => resource.name === "DBH").amount;

    if (health <= threshold && !thresholdTriggeredResources.includes("health")) {
        thresholdTriggeredResources.push("health");
    }

    if (motivation <= threshold && !thresholdTriggeredResources.includes("motivation")) {
        thresholdTriggeredResources.push("motivation");
    }

    if (DBH >= (100 - threshold)/100 && !thresholdTriggeredResources.includes("DBH")) {
        thresholdTriggeredResources.push("DBH");
    }

    if (thresholdTriggeredResources.length > thresholdTriggerLength) {
        return true
    }
    else {
        return false
    }
}

function thresholdReset(resourceName) {
    const initialLength = thresholdTriggeredResources.length;

    thresholdTriggeredResources = thresholdTriggeredResources.filter(name => name !== resourceName);

    if (thresholdTriggeredResources.length < initialLength) {
        console.log(`Threshold reset for ${resourceName}.`);
    } else {
        console.error(`Attempted to reset threshold for ${resourceName}, but it was not found in triggered resources.`);
    }
}