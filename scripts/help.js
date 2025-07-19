// Handles the help overlay
import common from "./common.js";

const helpOverlay = document.getElementById("helpOverlay");
const helpTextContainer = document.getElementById("helpTextContainer");
const helpArrowsSvg = document.getElementById("helpArrows");

const helpData = {
    "title-help": { 
        message: "This is the game's name!",
        offset: [-200, 40]
    },
    "date-help": {
        message: "This is the in-game date. Time will only progress when both a research and task are selected.",
        offset: [-screen.width/2 + 150, 40]
    },
    "save-button-help": {
        message: "Saves the game to your local storage.",
        offset: [-320, 100]
    },
    "help-button-help": {
        message: "You... just clicked this... It shows this helpful panel!",
        offset: [-200, 40]
    },
    "journal-button-help": {
        message: "Story lives here, there's a lot of it! Completely optional, but I worked hard on it. :(",
        offset: [-200, 100]
    },
    "settings-button-help": {
        message: "Settings live here.",
        offset: [-100, 40]
    },
    "resources-panel-help": {
        message: "Here are your various resources, if any of them hit 0 you're in for a bad time.",
        offset: [-200, 200]
    },
    "research-panel-help": {
        message: "Select an idea to research, the bottom bar shows how far along you are.",
        offset: [-200, 200]
    },
    "tasks-panel-help": {
        message: "Tasks are similar to research but you (almost) never complete them.",
        offset: [-200, 200]
    },
    "log-panel-help": {
        message: "This will relay happenings in the game world to your eyeball(s)/screen reader.",
        offset: [-200, 200]
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
    path.setAttribute("fill", "yellow"); // Arrowhead color

    marker.appendChild(path);
    defs.appendChild(marker);
    helpArrowsSvg.appendChild(defs);
}

export function showHelp() {

    common.pauseGame();
    helpOverlay.classList.add("active");
    helpTextContainer.innerHTML = ""; 
    helpArrowsSvg.innerHTML = ""; 
    createArrowhead();

    // Display text next to each element and draw arrows
    Object.keys(helpData).forEach(helpId => {
        const targetElement = document.querySelector(`[data-help-id="${helpId}"]`);
        if (targetElement) {
            const message = helpData[helpId].message;
            const offset = helpData[helpId].offset;
            addHelpEntry(targetElement, message, offset);
        }
    });

    helpOverlay.addEventListener("click", hideHelp);
}

export function hideHelp() {
    helpOverlay.classList.remove("active");
    helpTextContainer.innerHTML = "";
    helpArrowsSvg.innerHTML = "";
    helpOverlay.removeEventListener("click", hideHelp);
    common.unpauseGame();
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

    drawArrow(textDiv, targetElement);
}

function drawArrow(sourceElement, targetElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;

    const endX = targetRect.left + targetRect.width / 2 - 5;
    const endY = targetRect.top + targetRect.height / 2 + 10;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("marker-end", "url(#arrowhead)");

    helpArrowsSvg.appendChild(line);
}