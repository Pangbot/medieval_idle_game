// Handles various settings in the game (and opening/closing the menu)

import { showCustomTooltip, hideCustomTooltip } from "./buttons.js"; 
import { changeAutosaveInterval, saveGame, importSave, exportSave, deleteSave } from "./save.js";
import { restartClockCheck, stopClock } from "./time.js";
import common from "./common.js";

const gameOverlay = document.getElementById("gameOverlay");
const settingsContainer = document.getElementById("settingsContainer");

const restartWarning = settingsContainer.querySelector(".restart-warning");

const musicVolumeInput = document.getElementById("musicVolume");
const musicVolumeValueSpan = document.getElementById("musicVolumeValue");

const sfxVolumeInput = document.getElementById("sfxVolume");
const sfxVolumeValueSpan = document.getElementById("sfxVolumeValue");

const thresholdInput = document.getElementById("threshold");
const thresholdValueSpan = document.getElementById("thresholdValue");
const thresholdLabel = document.querySelector('label[for="threshold"]');
const thresholdAlwaysOnCheckbox = document.getElementById("thresholdAlwaysOn");

const windowSizeSelect = document.getElementById("emulateWindowSize");
const emulateWindowSizeLabel = document.querySelector('label[for="emulateWindowSize"]');
const emulateWindowSizeTooltip = document.getElementById("emulateWindowSizeTooltip");

const autosaveIntervalInput = document.getElementById("autosaveInterval");
const autosaveIntervalValueSpan = document.getElementById("autosaveIntervalValue");

const importSaveButton = settingsContainer.querySelector(".import-save-btn");
const importSaveTextBox = document.getElementById("importSaveTextBox");
const exportSaveButton = settingsContainer.querySelector(".export-save-btn");
const deleteSaveButton = settingsContainer.querySelector(".delete-save-btn");
const closeButton = settingsContainer.querySelector(".close-button");

let restartRequired = false;
let previousWidth;

export function initialiseSettings() {
    importSaveButton.addEventListener("click", () => {
        const saveString = importSaveTextBox.value;
        importSave(saveString);
        common.notify("Save imported successfully! :D");
    });
    exportSaveButton.addEventListener("click", exportSave);
    deleteSaveButton.addEventListener("click", deleteSave);
    closeButton.addEventListener("click", hideSettings);
    gameOverlay.addEventListener("click", hideSettings);

    settingsContainer.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    loadSettings(common.getGameState().savedSettings);

    musicVolumeInput.addEventListener("input", (event) => {
        const volume = event.target.value;
        musicVolumeValueSpan.textContent = `${volume}%`;
        common.getGameState().savedSettings.musicVolume = parseInt(volume);
        // TODO: Update actual music volume here
    });

    sfxVolumeInput.addEventListener("input", (event) => {
        const volume = event.target.value;
        sfxVolumeValueSpan.textContent = `${volume}%`;
        common.getGameState().savedSettings.sfxVolume = parseInt(volume);
        // TODO: Update actual SFX volume here
    });

    thresholdInput.addEventListener("input", (event) => {
        const threshold = event.target.value;
        thresholdValueSpan.textContent = `${threshold}%`;
        common.getGameState().savedSettings.threshold = parseInt(threshold);
    });

    thresholdLabel.addEventListener("mouseover", (event) => {
        const tooltipText = document.getElementById("thresholdTooltip").textContent;
        if (tooltipText) {
            showCustomTooltip(tooltipText, event.clientX, event.clientY);
        }
    });

    thresholdLabel.addEventListener("mouseout", () => {
        hideCustomTooltip();
    });

    thresholdAlwaysOnCheckbox.addEventListener("change", (event) => {
        common.getGameState().savedSettings.thresholdAlwaysOn = event.target.checked;
    });

    windowSizeSelect.addEventListener("change", (event) => {
        let width = parseInt(event.target.value);

        if (width !== previousWidth) {
            restartWarning.classList.add("active");
            restartRequired = true;
        } else {
            restartWarning.classList.remove("active");
            restartRequired = false;
        }

        common.getGameState().savedSettings.windowSize = width;
    });

    emulateWindowSizeLabel.addEventListener("mouseover", (event) => { // Changed to emulateWindowSizeLabel
        const tooltipText = emulateWindowSizeTooltip.textContent;
        if (tooltipText) {
            showCustomTooltip(tooltipText, event.clientX, event.clientY);
        }
    });

    emulateWindowSizeLabel.addEventListener("mouseout", () => { // Changed to emulateWindowSizeLabel
        hideCustomTooltip();
    });

    autosaveIntervalInput.addEventListener("input", (event) => {
        const interval = event.target.value;
        autosaveIntervalValueSpan.textContent = interval === "0" ? "Never" : `${interval} seconds`;
        common.getGameState().savedSettings.autosaveInterval = parseInt(interval);
    });
}

export function loadSettings(settingsData) {
    musicVolumeInput.value = settingsData.musicVolume;
    musicVolumeValueSpan.textContent = `${settingsData.musicVolume}%`;

    sfxVolumeInput.value = settingsData.sfxVolume;
    sfxVolumeValueSpan.textContent = `${settingsData.sfxVolume}%`;

    thresholdInput.value = settingsData.threshold;
    thresholdValueSpan.textContent = `${settingsData.threshold}%`;
    thresholdAlwaysOnCheckbox.checked = settingsData.thresholdAlwaysOn;

    windowSizeSelect.value = settingsData.windowSize;

    autosaveIntervalInput.value = settingsData.autosaveInterval;
    autosaveIntervalValueSpan.textContent = settingsData.autosaveInterval === 0 ? "Never" : `${settingsData.autosaveInterval} seconds`;
    changeAutosaveInterval(settingsData.autosaveInterval);
}

export function showSettings() {
    stopClock();
    gameOverlay.classList.add("active");
    settingsContainer.classList.add("active");
    previousWidth = common.getGameState().savedSettings.windowSize;
    loadSettings(common.getGameState().savedSettings);
}

function hideSettings() {
    gameOverlay.classList.remove("active");
    settingsContainer.classList.remove("active");
    changeAutosaveInterval(common.getGameState().savedSettings.autosaveInterval);
    importSaveTextBox.value = ''; 
    if (restartRequired) {
        saveGame();
        location.reload();
    } else {
        restartClockCheck();
    }
}