// Handles saving and loading data
import common from './common.js';

let autosaveTimer = null; // Holds ID for autosave interval
let countdownTimer;
let secondsUntilNextSave;

export function saveGame() {
    let state = common.getGameState();

    let playerCopy = { ...state.player };

    // Need to convert set to array for stringify
    playerCopy.completed = Array.from(playerCopy.completed);
    state.player = playerCopy;

    localStorage.setItem("saveData", JSON.stringify(state))
    console.log("Game saved")
    console.log(state)
}

export function loadGame() {
    const raw = localStorage.getItem("saveData");
    if (raw) {
        common.setGameState(JSON.parse(raw))
        startAutosave();
    }
    else {
        common.notify("No save found! :(")
    }
}

export function importSave(saveString) {
    saveString = decodeSaveData(saveString);
    if (isValidSave(saveString)) {
        common.setGameState(JSON.parse(saveString));
        saveGame();
        common.notify(`Save imported successfully! :D`)
    }
    else {
        common.notify(`Save string is invalid. :/`)
    }
}

export function exportSave() {
    const saveData = encodeSaveData(localStorage.getItem("saveData"));
    if (saveData) {
        const blob = new Blob([saveData], { type: "text/plain" });
        const filename = `BttP_save.txt`;

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        common.notify("Save exported successfully!");
    } else {
        common.notify("No save data to export!");
    }
}

export function deleteSave() {
    if (common.check("Are you sure you want to delete your save? This cannot be undone!")) {
        localStorage.removeItem("saveData");
        location.reload();
    }
}

function isValidSave(saveString) {
    try {
        const state = JSON.parse(saveString);

        if (!state || typeof state !== 'object') {
            console.warn("isValidSave failed: State is not an object or is null.");
            return false;
        }

        if (!state.player || typeof state.player !== 'object') {
            console.warn("isValidSave failed: state.player is missing or not an object.");
            return false;
        }

        if (!state.savedSettings || typeof state.savedSettings !== 'object') {
            console.warn("isValidSave failed: state.savedSettings is missing or not an object.");
            return false;
        }

        const windowSize = parseInt(state.savedSettings.windowSize);
        if (isNaN(windowSize)) {
            console.warn("isValidSave failed: state.savedSettings.windowSize is not a valid number.");
            return false;
        }

        return true;
    } catch (e) {
        console.error("isValidSave failed due to JSON parsing error or invalid structure:", e);
        return false;
    }
}

function encodeSaveData(data) {
    return btoa(data);
}

function decodeSaveData(encodedData) {
    return atob(encodedData);
}

export function changeAutosaveInterval(interval) {
    startAutosave(interval);
}

function startAutosave(interval = null) {
    if (autosaveTimer) {
        clearInterval(autosaveTimer);
        autosaveTimer = null;
    }

    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    if(!(interval)) {
        interval = common.getGameState().savedSettings.autosaveInterval;
    }

    if (interval > 0) {
        secondsUntilNextSave = interval;

        // Start the main autosave timer
        autosaveTimer = setInterval(() => {
            saveGame();
            // Reset the countdown timer
            secondsUntilNextSave = interval;
        }, interval * 1000);

        // Start the countdown timer that updates the button every second
        countdownTimer = setInterval(() => {
            secondsUntilNextSave--;
            updateSaveButton();
        }, 1000);
    }

    updateSaveButton();
}

function updateSaveButton() {
    const saveButton = document.getElementById("saveBtn");
    if (autosaveTimer) {
        if (secondsUntilNextSave === 0) {
            saveButton.innerHTML = `Saving now...`
        }
        else {
            saveButton.innerHTML = `Saving in ${secondsUntilNextSave} seconds...`;
        }
    }
    else {
        saveButton.innerHTML = `Save`;
    }
}