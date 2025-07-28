// Handles the help overlay
import common from "./common.js";
import { stopClock, restartClockCheck } from "./time.js";

const gameOverlay = document.getElementById("gameOverlay");
const helpTextContainer = document.getElementById("helpTextContainer");
const helpArrowsSvg = document.getElementById("helpArrows");

let windowSize;
let smallOffset;
let medOffset;

const helpData = {
    "title-help": { 
        message: "This is the game's name!",
        offset: [-1, 1]
    },
    "date-help": {
        message: "This is the in-game date. Time will only progress when both a research and task are selected.",
        offset: [-5, 1]
    },
    "save-button-help": {
        message: "Saves the game to your local storage.",
        offset: [-2.92, 1]
    },
    "help-button-help": {
        message: "You... just clicked this... It shows this helpful panel!",
        offset: [-2, 1]
    },
    "journal-button-help": {
        message: "Story lives here, there's a lot of it! Completely optional, but I worked hard on it. :(",
        offset: [-1.25, 1]
    },
    "settings-button-help": {
        message: "Settings live here.",
        offset: [-0.5, 1]
    },
    "resources-panel-help": {
        message: "Here is your money, health, and motivation.",
        offset: [-1, 2]
    },
    "health-bar-help": {
        message: "If your health is low, you're more likely to get sick. If it hits 0, you die.",
        offset: [0, 1]
    },
    "motivation-bar-help": {
        message: "If your motivation is low, your productivity will decrease. If it hits 0, you will not work on progress to a time machine.",
        offset: [0, 1]
    },
    "DBH-bar-help": {
        message: "This is the Dimensional Breakpoint Horizon. Almost anything you do will increase this. Weird things will happen as this gets high. If it reaches 1 the Universe will kill you off.",
        offset: [0, 1]
    },
    "inventory-help": {
        message: "This is where your things are. Some tasks give you things. Other tasks require things. Things are good. Try to get some things.",
        offset: [0, 1]
    },
    "research-panel-help": {
        message: "Select an idea to research, the bottom bar shows how far along you are.",
        offset: [-1, 3]
    },
    "tasks-panel-help": {
        message: "Tasks are similar to research but you (almost) never complete them.",
        offset: [-1, 3]
    },
    "log-panel-help": {
        message: "This will relay happenings in the game world to your eyeball(s)/screen reader.",
        offset: [-1, 3]
    },
};

function createArrowhead() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "5"); // Point of the arrow
    marker.setAttribute("refY", "5"); // Center vertically
    marker.setAttribute("orient", "auto-start-reverse"); // Rotate with path
    marker.setAttribute("markerUnits", "strokeWidth"); // Scale with stroke

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M0,0 L10,5 L0,10 L3,5 Z"); // Triangle shape
    path.setAttribute("fill", "#A7D9B4");

    marker.appendChild(path);
    defs.appendChild(marker);
    helpArrowsSvg.appendChild(defs);
}

export function showHelp() {
    windowSize = common.getGameState().savedSettings.windowSize;
    smallOffset = windowSize / 40;
    medOffset = windowSize / 10;
    
    stopClock();
    gameOverlay.classList.add("active");
    helpTextContainer.innerHTML = ""; 
    helpArrowsSvg.innerHTML = ""; 
    createArrowhead();

    // Display text next to each element and draw arrows
    Object.keys(helpData).forEach(helpId => {
        if (helpId === "DBH-bar-help" && !common.unlockedDBH) {
            return;
        }
        const targetElement = document.querySelector(`[data-help-id="${helpId}"]`);
        if (targetElement) {
            const message = helpData[helpId].message;
            const scaledOffset = [helpData[helpId].offset[0] * medOffset, helpData[helpId].offset[1] * smallOffset];
            addHelpEntry(targetElement, message, scaledOffset);
        }
    });

    gameOverlay.addEventListener("click", hideHelp);
}

export function hideHelp() {
    gameOverlay.classList.remove("active");
    helpTextContainer.innerHTML = "";
    helpArrowsSvg.innerHTML = "";
    gameOverlay.removeEventListener("click", hideHelp);
    restartClockCheck();
}

function addHelpEntry(targetElement, message, offset) {
    const rect = targetElement.getBoundingClientRect();

    // Create help text element
    const textDiv = document.createElement("div");
    textDiv.classList.add("help-text-entry");
    textDiv.textContent = message;
    textDiv.offset = offset;
    helpTextContainer.appendChild(textDiv);

    // Position the text
    let textX = rect.right + offset[0]
    let textY = rect.top + offset[1]

    textDiv.style.left = `${textX}px`;
    textDiv.style.top = `${textY}px`;
    textDiv.style.maxWidth = `${medOffset}px`; 

    drawArrow(textDiv, targetElement);
}

function drawArrow(sourceElement, targetElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    let startX = sourceRect.left + sourceRect.width / 2;
    let startY = sourceRect.top + sourceRect.height / 2;
    let endX = targetRect.left + targetRect.width / 2;
    let endY = targetRect.top + targetRect.height / 2;

    // Check if the targetElement is one of the panel elements
    const helpId = targetElement.getAttribute('data-help-id');
    const isPanel = [
        "resources-panel-help",
        "research-panel-help",
        "tasks-panel-help",
        "log-panel-help"
    ].includes(helpId);

    if (isPanel) {
        endX = targetRect.left + targetRect.width / 2;
        endY = targetRect.top + 130;
    } else {
        endX = targetRect.left + targetRect.width / 2 - 5;
        endY = targetRect.top + targetRect.height / 2 + 10;
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("marker-end", "url(#arrowhead)");

    helpArrowsSvg.appendChild(line);
}