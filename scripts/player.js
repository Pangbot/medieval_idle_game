// Handles the player's resources and stats

import { restartClockCheck } from "./time.js";
import { updateTabButtons } from "./buttons.js";
import { changeTaskTab } from "./tasks.js";
import { changeResearchTab } from "./research.js";
import { taskTabs } from "./data/taskList.js";
import { researchTabs } from "./data/researchList.js";

let player = {
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

function loadPlayer(data) {
    player = data
}

function adjustResource(resourceName, amount) {
    const resourceObj = player.resources.find(resource => resource.name === resourceName);

    if (resourceObj) {
        resourceObj.amount += amount;
    } else {
        newResource(resourceName, amount);
    }
}

function newResource(resource, amount) {
    player.resources.push({name: resource, amount: amount});
}

function changeTask(taskID) {
    if (taskID === player.selectedTaskID) {
        player.selectedTaskID = null;
    }
    else {
        player.selectedTaskID = taskID;
    }
    updateTabButtons("taskTabs");
    restartClockCheck();
}

function changeResearch(researchID) {
    if (researchID === player.selectedResearchID) {
        player.selectedResearchID = null;
    }
    else {
        player.selectedResearchID = researchID;
    }
    updateTabButtons("researchTabs");
    restartClockCheck();
}

export { player, loadPlayer, adjustResource, changeTask, changeResearch };