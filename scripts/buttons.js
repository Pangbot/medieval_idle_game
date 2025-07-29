// Creates/destroys buttons
import { saveGame } from "./save.js"
import { showHelp } from "./help.js"
import { showSettings } from "./settings.js";
import { taskTabs } from "./data/taskList.js";
import { researchTabs } from "./data/researchList.js";
import { changeResearch, changeTask, player } from "./player.js";
import { changeResearchTab, currentResearchTab, updateResearches } from "./research.js";
import { changeTaskTab, currentTaskTab, updateTasks } from "./tasks.js";
import { addProgressElements, addCompletionProgressBar } from "./animations.js";
import common from "./common.js";

export let buttonClickSound = new Audio("../audio/button_click.mp3");
let isSoundLoaded = true;

export function playButtonClickSound() {
    if (isSoundLoaded) {
        buttonClickSound.play();
    }
}

export function addMainListeners() {
    if (!buttonClickSound) {
        console.error("button_click.mp3 not found in audio folder.")
        isSoundLoaded = false;
    }

    const saveButton = document.getElementById("saveBtn");
    saveButton.addEventListener("click", () => {
        saveGame();
        playButtonClickSound();
    });

    const helpButton = document.getElementById("helpBtn");
    helpButton.addEventListener("click", () => {
        showHelp();
        playButtonClickSound();
    });

    const settingsButton = document.getElementById("settingsBtn");
    settingsButton.addEventListener("click", () => {
        showSettings();
        playButtonClickSound();
    });

    createTabButtons("researchTabs", researchTabs, changeResearchTab);
    createTabButtons("taskTabs", taskTabs, changeTaskTab);
}

function createTabButtons(containerID, tabDataArray, changeTabFunction) { // Used for initialisation and updating tabSize
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Container with ID "${containerID}" not found for tab buttons.`);
        return;
    }

    container.innerHTML = "";

    tabDataArray.forEach((tabID) => {
        const button = document.createElement("button");
        button.id = tabID;
        button.classList.add("tab-button");
        const firstLetter = tabID.charAt(0).toUpperCase();
        button.dataset.description = firstLetter + tabID.slice(1).replace("-", " ");

        const icon = document.createElement("img");
        icon.src = `icons/` + tabID + `.png`;
        icon.width = common.tabSize;
        icon.height = common.tabSize;
        icon.draggable = false;

        button.addEventListener("click", () => {
            changeTabFunction(tabID);
            playButtonClickSound();
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

        button.appendChild(icon);
        container.appendChild(button);
    });
}

export function updateTabButtons(containerID) {
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Container with ID "${containerID}" not found for tab buttons.`);
        return;
    }

    const tabButtons = container.querySelectorAll(".tab-button");
    if (!tabButtons) {
        console.error(`Container with ID "${containerID}" has no tab buttons.`);
        return;
    }

    tabButtons.forEach(button => {
        button.classList.remove("selected-button", "active-button");
    })

    let currentTabID = null;
    let selectedActionTabID = null; // The tab with a selected task/researcb

    if (containerID === "researchTabs") {
        currentTabID = currentResearchTab;
        if (player.selectedResearchID) {
            selectedActionTabID = common.researchMap.get(player.selectedResearchID).tab;
        }
    } else if (containerID === "taskTabs") {
        currentTabID = currentTaskTab;
        if (player.selectedTaskID) {
            selectedActionTabID = common.taskMap.get(player.selectedTaskID).tab;
        }
    }

    tabButtons.forEach(tabButton => {
        if (tabButton.id === currentTabID) {
            tabButton.classList.add("active-button");

            if ((selectedActionTabID) && tabButton.id === selectedActionTabID) {
                tabButton.classList.add("selected-button");
            }
        }
        else if ((selectedActionTabID) && tabButton.id === selectedActionTabID) {
            tabButton.classList.add("selected-button");
        }
    });
}

export function createActionButtons(containerID, actions, type) {
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Container with ID "${containerID}" not found for ${type} buttons.`);
        return;
    }
    
    if (!actions || actions.length === 0) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `No ${type} available in this tab. :(`;
        container.appendChild(messageDiv);
        return;
    }

    actions.forEach(action => {
        const button = document.createElement("button");

        const span = document.createElement("span");
        span.textContent = action.buttonName;
        button.appendChild(span);

        button.classList.add("progress-button");
        button.dataset.tabID = action.tab;

        if (type === "tasks") {
            button.dataset.taskID = action.id;
        } else if (type === "researches") {
            button.dataset.researchID = action.id;
        }

        let description = action.description;

        // Filter out bar resources and only include resources that are consumed
        const filteredResources = action.resources.filter(resource =>
            resource.name !== "health" &&
            resource.name !== "motivation" &&
            resource.name !== "DBH" &&
            resource.amount < 0
        );

        if (filteredResources.length > 0) {
            description += "<br><br>Required to run:<br>";
            filteredResources.forEach(resource => {
                if (resource.amount === -1) {
                    description += `${Math.abs(resource.amount)} ${resource.name.slice(0, -1)}<br>`;
                } else {
                    description += `${Math.abs(resource.amount)} ${resource.name}<br>`;
                }
            });
        }

        if (!ableToRunAction(action)) {
            description += "<br><b>(insufficient resources)</b>";
            button.disabled = true;
            button.classList.add("unavailable-action");
        } else {
            button.disabled = false;
            button.classList.remove("unavailable-action");
        }

        button.dataset.description = description;

        addProgressElements(button, action);
        addCompletionProgressBar(button, action);

        // Handle selected state based on type
        if (type === "tasks") {
            if (button.dataset.taskID === player.selectedTaskID && ableToRunAction(action)) {
                button.classList.add("selected-button");
            } else if (button.dataset.taskID === player.selectedTaskID && !(ableToRunAction(action))) {
                button.classList.remove("selected-button");
                changeTask(null);
            }
        } else if (type === "researches") {
            if (button.dataset.researchID === player.selectedResearchID && ableToRunAction(action)) {
                button.classList.add("selected-button");
            } else if (button.dataset.researchID === player.selectedResearchID && !(ableToRunAction(action))) {
                button.classList.remove("selected-button");
                changeResearch(null);
            }
        }

        button.addEventListener("click", () => {
            if (button.disabled) {
                return;
            }

            if (button.classList.contains("selected-button")) {
                button.classList.remove("selected-button");
            } else {
                const actionButtonsContainer = document.getElementById(`${type === "tasks" ? "taskBtns" : "researchBtns"}`);
                const allSelectableButtons = actionButtonsContainer.querySelectorAll(".progress-button");
                allSelectableButtons.forEach(btn => {
                    btn.classList.remove("selected-button");
                });

                button.classList.add("selected-button");
            }

            // Call the appropriate change function
            if (type === "tasks") {
                changeTask(action.id);
            } else if (type === "researches") {
                changeResearch(action.id);
            }
            playButtonClickSound();
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

export function updateActionButtons(containerID, actions, type) {
    const container = document.getElementById(containerID);
    if (!container) {
        console.error(`Container with ID "${containerID}" not found for ${type} buttons.`);
        return;
    }

    if (!actions || actions.length === 0) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `No ${type} available in this tab. :(`;
        container.appendChild(messageDiv);
        return;
    }

    actions.forEach(action => {
        let button;
        if (type === "tasks") {
            button = container.querySelector(`[data-task-i-d="${action.id}"]`);
        } else if (type === "researches") {
            button = container.querySelector(`[data-research-i-d="${action.id}"]`);
        }

        let description = action.description;

        const filteredResources = action.resources.filter(resource =>
            resource.name !== "health" &&
            resource.name !== "motivation" &&
            resource.name !== "DBH" &&
            resource.amount < 0
        );

        if (filteredResources.length > 0) {
            description += "<br><br>Required to run:<br>";
            filteredResources.forEach(resource => {
                if (resource.amount === -1) {
                    description += `${Math.abs(resource.amount)} ${resource.name.slice(0, -1)}<br>`;
                } else {
                    description += `${Math.abs(resource.amount)} ${resource.name}<br>`;
                }
            });
        }

        if (!ableToRunAction(action)) {
            description += "<br><b>(insufficient resources)</b>";
            button.disabled = true;
            button.classList.add("unavailable-action");
        } else {
            button.disabled = false;
            button.classList.remove("unavailable-action");
        }

        if (type === "tasks") {
            if (button.dataset.taskID === player.selectedTaskID && !(ableToRunAction(action))) {
                button.classList.remove("selected-button");
                changeTask(null);
            }
        } else if (type === "researches") {
            if (button.dataset.researchID === player.selectedResearchID && !(ableToRunAction(action))) {
                button.classList.remove("selected-button");
                changeResearch(null);
            }
        }

        button.dataset.description = description;
    });
}

export function unselectCurrentActions() { // Same behaviour as clicking on both active actions
    const taskButtonsContainer = document.getElementById("taskTabs");
    const researchButtonsContainer = document.getElementById("researchTabs");

    if (taskButtonsContainer) {
        const selectedTaskButton = taskButtonsContainer.querySelector(".progress-button.selected-button");
        if (selectedTaskButton) {
            selectedTaskButton.classList.remove("selected-button");
        }
    }

    if (researchButtonsContainer) {
        const selectedResearchButton = researchButtonsContainer.querySelector(".progress-button.selected-button");
        if (selectedResearchButton) {
            selectedResearchButton.classList.remove("selected-button");
        }
    }

    changeResearch(null);
    changeTask(null);

    updateResearches();
    updateTasks();
}

function ableToRunAction(action) {
    // Filter out bar resources and only include resources that are consumed
    const requiredResources = action.resources.filter(resource =>
        resource.name !== "health" &&
        resource.name !== "motivation" &&
        resource.name !== "DBH" &&
        resource.amount < 0
    );

    if (!(requiredResources)) {
        return true;
    }

    for (const requiredRes of requiredResources) {
        const playerResource = player.resources.find(resource => resource.name === requiredRes.name);

        // If player doesn"t have the resource at all, or doesn"t have enough
        if (!playerResource || playerResource.amount < Math.abs(requiredRes.amount)) {
            return false;
        }
    }
    return true;
}

const customTooltip = document.getElementById("customTooltip");

export function showCustomTooltip(message, x, y) {
    if (!customTooltip) {
        return;
    }
    customTooltip.innerHTML = message;
    // Position it slightly offset from the mouse cursor
    customTooltip.style.left = `${x + 15}px`;
    customTooltip.style.top = `${y + 15}px`;
    customTooltip.style.opacity = 1;
    customTooltip.style.visibility = "visible";
    customTooltip.style.transform = "translateY(0)";
}

export function hideCustomTooltip() {
    if (!customTooltip) {
        return;
    }
    customTooltip.style.opacity = 0;
    customTooltip.style.visibility = "hidden";
    customTooltip.style.transform = "translateY(-5px)";
}