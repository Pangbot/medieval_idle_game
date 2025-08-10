// Handles the player's resources and stats

import { restartClockCheck } from "./time.js";
import { updateTabButtons } from "./buttons.js";
import common from "./common.js";

let thresholdTriggeredResources = [];

export let player = {
    stats: [
        // Impact the game
        { name: "age", value: "young" }, // Planned: young/middle/old
        { name: "science", value: "physicist" }, // Planned: physicist/chemist/biologist
        { name: "hobby", value: "linguist" }, // Planned: linguist/artist/naturalist

        // Impact the journal entries
        { name: "reproductiveCapacity", value: "male" }, // Planned: (fertile) male/(fertile) female/infertile
        { name: "genderIdentity", value: "man" }, // Planned: man/woman/nonbinary
        { name: "pronouns", value: "hehim" }, // Planned: hehim/sheher/theythem
        { name: "romanticPreference", value: "women" }, // Planned: men/women/all/aromantic
    ],
    selectedTaskID: null,
    selectedResearchID: null,
    completed: new Set(),
    resources: [
        { name: "day", value: 0 },
        { name: "money", value: 0 },
        { name: "health", value: 100 },
        { name: "motivation", value: 100 },
        { name: "DBH", value: 0 }
    ],
};

export function loadPlayer(data) {
    player = data;
}

export function adjustResource(resourceName, value) {
    const resourceObj = player.resources.find(resource => resource.name === resourceName);

    if (resourceObj) {
        resourceObj.value += value;

        if (resourceName === "health" || resourceName === "motivation") {
            resourceObj.value = Math.max(0, Math.min(resourceObj.value, 100));
        }
        else if (resourceName === "DBH") {
            resourceObj.value = Math.max(0, Math.min(resourceObj.value, 1));
        }

        if (common.savedSettings.thresholdAlwaysOn) {
            if (resourceName === "health" && thresholdTriggeredResources.includes("health") && resourceObj.value >= 2*common.savedSettings.threshold) {
                thresholdReset(resourceName);
            } else if (resourceName === "motivation" && thresholdTriggeredResources.includes("motivation") &&  resourceObj.value >= 2*common.savedSettings.threshold) {
                thresholdReset(resourceName);
            } else if (resourceName === "DBH" && thresholdTriggeredResources.includes("DBH") && resourceObj.value <= (100 - (2*common.savedSettings.threshold)) / 100) {
                thresholdReset(resourceName);
            }
        }

    } else {
        newResource(resourceName, value);
    }
}

function newResource(resource, value) {
    player.resources.push({name: resource, value: value});
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

    let health = player.resources.find(resource => resource.name === "health").value;
    let motivation = player.resources.find(resource => resource.name === "motivation").value;
    let DBH = player.resources.find(resource => resource.name === "DBH").value;

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