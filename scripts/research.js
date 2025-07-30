// Handles the research panel
import { player, adjustResource, changeResearch } from "./player.js"
import { researchTabs, allResearches } from "./data/researchList.js"
import { createActionButtons, updateActionButtons, updateTabButtons } from "./buttons.js";
import common from "./common.js";
import { stopClock } from './time.js';
import { updateTasks } from "./tasks.js";
import { updateCompletionProgressBar, updateAnimations } from "./animations.js";

export let currentResearchTab = researchTabs[0];
export let allResearchesUpdated;
export let availableResearches = allResearches.filter(research => research.available === true);
let researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);

export function loadResearches(data) {
    const loadedResearchesMap = new Map();
    data.forEach(loadedResearch => {
        loadedResearchesMap.set(loadedResearch.id, loadedResearch);
    });

    allResearches.forEach(research => {
        const matchingLoadedResearch = loadedResearchesMap.get(research.id);

        if (matchingLoadedResearch) {
            Object.assign(research, matchingLoadedResearch);
        }
    });

    allResearchesUpdated = allResearches;

    availableResearches = allResearchesUpdated.filter(research => research.available === true && research.completed === false);
    researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);

    createActionButtons("researchBtns", researchesInTab, "researches");
}

export function loadCurrentResearchTab(tab) {
    currentResearchTab = tab;
    changeResearchTab(tab);
    updateTabButtons("researchTabs");
    updateResearches();
}

export function updateResearches() {
    const dayNumber = player.resources.find(resource => resource.name === "day").amount;
    allResearches.forEach(research => {
        if (research.completed) {
            research.available = false;
            return;
        }

        if (research.minDay > dayNumber) {
            research.available = false;
            return;
        }

        if (research.requires === null) {
            research.available = true;
        } else {
            const allRequiredCompleted = research.requires.every(requiredID =>
                player.completed.has(requiredID)
            );
            research.available = allRequiredCompleted;
        }
    });

    allResearchesUpdated = allResearches;
    availableResearches = allResearches.filter(research => research.available === true);
    researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);

    const researchContainer = document.getElementById("researchBtns");
    const currentResearchButtons = researchContainer.querySelectorAll(".progress-button");

    // Get the IDs of the currently rendered buttons
    const currentButtonIDs = Array.from(currentResearchButtons).map(button => button.dataset.researchID);

    const researchesInTabIDs = researchesInTab.map(research => research.id);

    currentButtonIDs.sort();
    researchesInTabIDs.sort();

    console.log(researchesInTabIDs.join(','));
    console.log(currentButtonIDs.join(','));
    // Check if the lengths are the same AND if the sorted ID strings are identical
    if (researchesInTabIDs.length !== currentButtonIDs.length || researchesInTabIDs.join(',') !== currentButtonIDs.join(',')) {
        createActionButtons("researchBtns", researchesInTab, "researches");
    } else {
        updateActionButtons("researchBtns", researchesInTab, "researches");
    }
    
}

export function changeResearchTab(targetTab) {
    if (!researchTabs.includes(targetTab)) {
        console.error(`Tab ${targetTab} not found in researchTabs (${researchTabs}).`)
    }

    if (currentResearchTab !== targetTab) {
        const tabsContainer = document.querySelector('#researchTabs');

        if (!tabsContainer) {
            console.error("Research tabs container not found.");
            return;
        }

        const oldTabObject = tabsContainer.querySelector('#' + currentResearchTab);
        const newTabObject = tabsContainer.querySelector('#' + targetTab);

        if (oldTabObject && oldTabObject.classList.contains('active-button')) {
            oldTabObject.classList.remove('active-button');
        }

        currentResearchTab = targetTab;

        if (newTabObject) {
            newTabObject.classList.add('active-button');
        } else {
            console.error(`New tab button '${targetTab}' not found.`);
        }

        updateResearches();
    }
}

export function updateResearchProgress() {
    const currentResearch = common.researchMap.get(player.selectedResearchID);

    if (!currentResearch) {
        console.error(`Selected research with ID '${player.selectedResearchID}' not found in researchMap.`);
        player.selectedResearchID = null;
        stopClock();
        return;
    }

    currentResearch.progress += 1;

    if (currentResearch.progress % currentResearch.resourcePeriod == 0) {
        currentResearch.resources.forEach(resourceObj => {
            adjustResource(resourceObj.name, resourceObj.amount);
        });
    }

    if (isValidCompletionTime(currentResearch)) {
        updateCompletionProgressBar(currentResearch);

        if (currentResearch.progress >= currentResearch.daysToComplete) {
            console.log(`Completed ${currentResearch.id}`);
            currentResearch.completed = true;
            currentResearch.available = false;
            player.completed.add(currentResearch.id);
            changeResearch(null);
        }
    }

    updateResearches();
    updateTasks();
    updateAnimations(currentResearch, player.selectedTaskID);
}

function isValidCompletionTime(currentResearch) {
    if (currentResearch.daysToComplete !== null && currentResearch.daysToComplete !== Infinity) {
        return true
    }
    else {
        return false
    }
}

export function resetAllResearchProgress() {
    allResearches.forEach(research => {
        research.workProgress = 0;
    });
    updateResearches();
}