// Handles animating task/research buttons and any other animations I think of adding
import common from "./common.js";
import { player } from "./player.js";

export function updateAnimations(currentResearch, currentTask) {
    const researchButton = document.querySelector(`button[data-research-i-d="${player.selectedResearchID}"]`);
    const taskButton = document.querySelector(`button[data-task-i-d="${player.selectedTaskID}"]`);
    
    if ((researchButton) && (currentResearch)) {
        const resProgressFill = researchButton.querySelector('.progress-fill');
        resProgressFill.style.width = `${currentResearch.workProgress / common.dayInMilliseconds * 100}%`;
    }
    if ((taskButton) && (currentTask)) {
        const taskProgressFill = taskButton.querySelector('.progress-fill');
        taskProgressFill.style.width = `${currentTask.workProgress / common.dayInMilliseconds * 100}%`;
    }
}

export function addProgressElements(button, action) { // action is either task or research
    const progressFill = document.createElement('div');
    progressFill.classList.add('progress-fill');
    button.appendChild(progressFill);
    
    let initialFill = action.workProgress / common.dayInMilliseconds;
    progressFill.style.width = `${initialFill * 100}%`;
}

export function addCompletionProgressBar(button, action) {
    if (action.daysToComplete === Infinity || !(action.daysToComplete)) {
        return; // Not completable
    }

    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'completion-progress-bar-container';

    const progressBarFill = document.createElement('div');
    progressBarFill.className = 'completion-progress-bar-fill';
    progressBarFill.id = `${action.id}-completion-progress-fill`;

    progressBarContainer.appendChild(progressBarFill);
    button.appendChild(progressBarContainer);

    const progressPercentage = (action.progress / action.daysToComplete) * 100;
    progressBarFill.style.width = `${progressPercentage}%`;
}

export function updateCompletionProgressBar(action) {
    const progressBarFill = document.getElementById(`${action.id}-completion-progress-fill`);

    if (progressBarFill) {
        const progressPercentage = (action.progress / action.daysToComplete) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
    }
}

export function addUpGlowEffect(itemElement) { // Temporary inventory glow for increased amount
    itemElement.classList.add("up-glow-animation");
    setTimeout(() => {
        itemElement.classList.remove("up-glow-animation");
    }, 1000);
}

export function addDownGlowEffect(itemElement) { // Temporary inventory glow for decreased amount
    itemElement.classList.add("down-glow-animation");
    setTimeout(() => {
        itemElement.classList.remove("down-glow-animation");
    }, 1000);
}