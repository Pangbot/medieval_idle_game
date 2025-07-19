// Handles the research area
import { player, adjustResource } from "./player.js"
import { researchTabs, allResearches } from "./data/researchList.js"
import { createTabResearchButtons } from "./buttons.js";
import { stopClock } from './time.js';

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
        } else if (Array.isArray(research.requires)) {
            const allRequiredCompleted = research.requires.every(requiredId =>
                player.researched.has(requiredId)
            );
            research.available = allRequiredCompleted;
        } else {
            research.available = player.researched.has(research.requires);
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

    if (!(currentResearchTab === targetTab)) {
        currentResearchTab = targetTab;
        updateResearches();
    }
}

function updateResearchProgress() {
    const currentResearch = allResearches.find(research => research.id === player.selectedResearchID);

    if (!currentResearch) {
        console.error(`Selected research with ID '${player.selectedResearchID}' not found in allResearches.`);
        player.selectedResearchID = null;
        stopClock();
        return;
    }

    currentResearch.progress += 1;
    currentResearch.resourceProgress += 1;

    if (currentResearch.resourceProgress >= currentResearch.resourcePeriod) {
        adjustResource('money', currentResearch.money);
        adjustResource('health', currentResearch.health);
        adjustResource('motivation', currentResearch.motivation);
        adjustResource('DBH', currentResearch.DBH);
        currentResearch.resourceProgress = 0;
    }

    if (currentResearch.progress >= currentResearch.daysToComplete) {
        currentResearch.completed = true;
        currentResearch.available = false;
        player.researched.add(player.selectedResearchID)

        player.selectedResearchID = null;
        updateResearches();
        stopClock();
    }
}

export { availableResearches, loadResearches, loadCurrentResearchTab, updateResearches, currentResearchTab, changeResearchTab, updateResearchProgress }