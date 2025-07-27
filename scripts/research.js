// Handles the research area
import { player, adjustResource, changeResearch } from "./player.js"
import { researchTabs, allResearches } from "./data/researchList.js"
import { createTabResearchButtons } from "./buttons.js";
import common from "./common.js";
import { stopClock } from './time.js';
import { updateTasks } from "./tasks.js";
import { updateCompletionProgressBar } from "./animations.js";

let currentResearchTab = researchTabs[0];
let availableResearches = allResearches.filter(research => research.available === true);
let researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);

function loadResearches(data) {
    availableResearches = data;
    researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);
    updateResearches();
}

function loadCurrentResearchTab(tab) {
    currentResearchTab = tab;
}

function updateResearches() {
    allResearches.forEach(research => {
        if (research.completed) {
            research.available = false;
            return;
        }

        if (research.requires === null) {
            research.available = true;
        } else {
            const allRequiredCompleted = research.requires.every(requiredId =>
                player.completed.has(requiredId)
            );
            research.available = allRequiredCompleted;
        }
    });
    availableResearches = allResearches.filter(research => research.available === true);
    researchesInTab = availableResearches.filter(research => research.tab === currentResearchTab);
    createTabResearches();
}

function createTabResearches() {
    const researchInTabContainer = document.getElementById("resInTabBtns");
    researchInTabContainer.innerHTML = '';
    createTabResearchButtons(researchInTabContainer, researchesInTab);
}

function changeResearchTab(targetTab) {
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

function updateResearchProgress() {
    const currentResearch = common.researchMap.get(player.selectedResearchID);

    if (!currentResearch) {
        console.error(`Selected research with ID '${player.selectedResearchID}' not found in researchMap.`);
        player.selectedResearchID = null;
        stopClock();
        return;
    }

    currentResearch.progress += 1;
    updateCompletionProgressBar(currentResearch);

    if (currentResearch.progress % currentResearch.resourcePeriod == 0) {
        currentResearch.resources.forEach(resourceObj => {
            adjustResource(resourceObj.name, resourceObj.amount);
        });
    }

    if (currentResearch.progress >= currentResearch.daysToComplete) {
        currentResearch.completed = true;
        currentResearch.available = false;
        player.completed.add(player.selectedResearchID)

        changeResearch(null);
        updateResearches();
        updateTasks();
    }
}

export { availableResearches, loadResearches, loadCurrentResearchTab, updateResearches, currentResearchTab, changeResearchTab, updateResearchProgress }