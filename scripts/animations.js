// Handles animating task/research buttons and any other animations I think of adding
import common from "./common.js";
import { player } from "./player.js";

export function updateAnimations(currentResearch, currentTask) {
    const researchButton = document.querySelector(`button[data-research-i-d="${player.selectedResearchID}"]`);
    const taskButton = document.querySelector(`button[data-task-i-d="${player.selectedTaskID}"]`);
    
    if (researchButton) {
        const resProgressFill = researchButton.querySelector('.progress-fill');
        resProgressFill.style.width = `${currentResearch.workProgress / common.dayInMilliseconds * 100}%`;
    }
    if (taskButton) {
        const taskProgressFill = taskButton.querySelector('.progress-fill');
        taskProgressFill.style.width = `${currentTask.workProgress / common.dayInMilliseconds * 100}%`;
    }
}

export function addProgressElements(button, dataObject) { // dataObject is either task or research
    const progressFill = document.createElement('div');
    progressFill.classList.add('progress-fill');
    button.appendChild(progressFill);
    
    let initialFill = dataObject.workProgress / common.dayInMilliseconds;
    progressFill.style.width = `${initialFill * 100}%`;
}