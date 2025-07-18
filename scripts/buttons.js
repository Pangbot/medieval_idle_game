// Handles logic for the buttons to work
import { saveGame } from "./save.js"
import { showHelp } from "./help.js"


export function addMainListeners() {
    const saveButton = document.getElementById("saveBtn")

    saveButton.addEventListener("click", saveGame)

    const helpButton = document.getElementById("helpBtn")

    helpButton.addEventListener("click", showHelp)
}

export function removeMainListeners() {
    const saveButton = document.getElementById("saveBtn");
    
    saveButton.removeEventListener("click", saveGame);

    const helpButton = document.getElementById("helpBtn");
    
    helpButton.removeEventListener("click", showHelp);
}
