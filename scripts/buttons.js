// Creates/destroys buttons
import { saveGame } from "./save.js"
import { showHelp } from "./help.js"
import { taskTabs } from "./data/taskList.js";
import { researchTabs } from "./data/researchList.js";
import { changeResearch, changeTask } from "./player.js";
import { changeTaskTab } from "./tasks.js";
import { changeResearchTab } from "./research.js";

export function addMainListeners() {
    const saveButton = document.getElementById("saveBtn");
    saveButton.addEventListener("click", saveGame);

    const helpButton = document.getElementById("helpBtn");
    helpButton.addEventListener("click", showHelp);

    const taskTabOneButton = document.getElementById("taskTabOne");
    taskTabOneButton.addEventListener("click", () => changeTaskTab(taskTabs[0]));

    const taskTabTwoButton = document.getElementById("taskTabTwo");
    taskTabTwoButton.addEventListener("click", () => changeTaskTab(taskTabs[1]));

    const taskTabThreeButton = document.getElementById("taskTabThree");
    taskTabThreeButton.addEventListener("click", () => changeTaskTab(taskTabs[2]));

    const taskTabFourButton = document.getElementById("taskTabFour");
    taskTabFourButton.addEventListener("click", () => changeTaskTab(taskTabs[3]));

    const researchTabOneButton = document.getElementById("resTabOne");
    researchTabOneButton.addEventListener("click", () => changeResearchTab(researchTabs[0]));

    const researchTabTwoButton = document.getElementById("resTabTwo");
    researchTabTwoButton.addEventListener("click", () => changeResearchTab(researchTabs[1]));

    const researchTabThreeButton = document.getElementById("resTabThree");
    researchTabThreeButton.addEventListener("click", () => changeResearchTab(researchTabs[2]));

    const researchTabFourButton = document.getElementById("resTabFour");
    researchTabFourButton.addEventListener("click", () => changeResearchTab(researchTabs[3]));
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

        button.textContent = research.buttonName;
        button.classList.add("research-button");
        button.dataset.researchId = research.id;
        button.dataset.description = research.description;

        button.addEventListener("click", () => {
            console.log(`Research button clicked: ${research.id}`);
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

        button.textContent = task.buttonName;
        button.classList.add("task-button");
        button.dataset.taskId = task.id;
        button.dataset.description = task.description;

        button.addEventListener("click", () => {
            console.log(`Task button clicked: ${task.id}`);
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