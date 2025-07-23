// Creates/destroys buttons
import { saveGame } from "./save.js"
import { showHelp } from "./help.js"
import { taskTabs } from "./data/taskList.js";
import { researchTabs } from "./data/researchList.js";
import { changeResearch, changeTask, player } from "./player.js";
import { changeTaskTab } from "./tasks.js";
import { changeResearchTab } from "./research.js";
import { addProgressElements } from "./animations.js";

export function addMainListeners() {
    const saveButton = document.getElementById("saveBtn");
    saveButton.addEventListener("click", saveGame);

    const helpButton = document.getElementById("helpBtn");
    helpButton.addEventListener("click", showHelp);

    createTabButtons("researchTabs", researchTabs, changeResearchTab, "researchTab");

    createTabButtons("taskTabs", taskTabs, changeTaskTab, "taskTab");
}

function createTabButtons(containerId, tabDataArray, changeTabFunction, buttonIdPrefix) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found for tab buttons.`);
        return;
    }

    container.innerHTML = '';

    tabDataArray.forEach((_, index) => {
        const button = document.createElement("button");
        button.id = `${buttonIdPrefix}${index + 1}`;
        button.textContent = `${index + 1}`;
        button.classList.add("tab-button");

        button.addEventListener("click", () => {
            changeTabFunction(tabDataArray[index]);
        });

        container.appendChild(button);
    });
}

export function createTabResearchButtons(container, researches) {
    if (!researches || researches.length === 0) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `No researches available in this tab. :(`;
        container.appendChild(messageDiv);
        return;
    }

    researches.forEach(research => {
        const button = document.createElement("button");

        const span = document.createElement('span');
        span.textContent = research.buttonName;
        button.appendChild(span);

        button.classList.add("progress-button");
        button.dataset.researchID = research.id;
        button.dataset.description = research.description;

        addProgressElements(button, research);

        if (button.dataset.researchID === player.selectedResearchID) {
            button.classList.add('selected-button');
        }

        button.addEventListener("click", () => {
            if (button.classList.contains('selected-button')) {
                button.classList.remove('selected-button');
            } else {
                const researchButtonsContainer = document.getElementById('resInTabBtns');
                const allSelectableButtons = researchButtonsContainer.querySelectorAll('.progress-button');
                allSelectableButtons.forEach(btn => {
                    btn.classList.remove('selected-button');
                });

                button.classList.add('selected-button');
            }
            changeResearch(research.id);
        });

        button.addEventListener("mouseover", (event) => {
            const description = event.currentTarget.dataset.description;
            if (description) {
                showCustomTooltip(description, event.clientX, event.clientY);
            }
        });

        button.addEventListener("mousemove", (event) => {
            showCustomTooltip(event.currentTarget.dataset.description, event.clientX, event.clientY);
        });

        button.addEventListener("mouseout", () => {
            hideCustomTooltip();
        });

        container.appendChild(button);
    });
}

export function createTabTaskButtons(container, tasks) {
    if (!tasks || tasks.length === 0) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `No tasks available in this tab. :(`;
        container.appendChild(messageDiv);
        return;
    }

    tasks.forEach(task => {
        const button = document.createElement("button");

        const span = document.createElement('span');
        span.textContent = task.buttonName;
        button.appendChild(span);

        button.classList.add("progress-button");
        button.dataset.taskID = task.id;
        button.dataset.description = task.description;

        addProgressElements(button, task);

        if (button.dataset.taskID === player.selectedTaskID) {
            button.classList.add('selected-button');
        }

        button.addEventListener("click", () => {
            if (button.classList.contains('selected-button')) {
                button.classList.remove('selected-button');
            } else {
                const taskButtonsContainer = document.getElementById('taskInTabBtns');
                const allSelectableButtons = taskButtonsContainer.querySelectorAll('.progress-button');
                allSelectableButtons.forEach(btn => {
                    btn.classList.remove('selected-button');
                });

                button.classList.add('selected-button');
            }
            changeTask(task.id);
        });

        button.addEventListener("mouseover", (event) => {
            const description = event.currentTarget.dataset.description;
            if (description) {
                showCustomTooltip(description, event.clientX, event.clientY);
            }
        });

        button.addEventListener("mousemove", (event) => {
            showCustomTooltip(event.currentTarget.dataset.description, event.clientX, event.clientY);
        });

        button.addEventListener("mouseout", () => {
            hideCustomTooltip();
        });

        container.appendChild(button);
    });
}

const customTooltip = document.getElementById("customTooltip");

function showCustomTooltip(message, x, y) {
    if (!customTooltip) return;

    customTooltip.innerHTML = message;
    // Position it slightly offset from the mouse cursor
    customTooltip.style.left = `${x + 15}px`;
    customTooltip.style.top = `${y + 15}px`;
    customTooltip.style.opacity = 1;
    customTooltip.style.visibility = 'visible';
    customTooltip.style.transform = 'translateY(0)';
}

function hideCustomTooltip() {
    if (!customTooltip) return;
    customTooltip.style.opacity = 0;
    customTooltip.style.visibility = 'hidden';
    customTooltip.style.transform = 'translateY(-5px)';
}