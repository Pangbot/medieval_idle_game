// Handles various settings in the game (and opening/closing the menu)

import { showCustomTooltip, hideCustomTooltip, buttonClickSound, playButtonClickSound } from "./buttons.js"; 
import { changeAutosaveInterval, saveGame, importSave, exportSave, deleteSave } from "./save.js";
import { restartClockCheck, stopClock } from "./time.js";
import common from "./common.js";

const gameOverlay = document.getElementById("gameOverlay");
const settingsContainer = document.getElementById("settingsContainer");

const restartWarning = settingsContainer.querySelector(".restart-warning");

// const musicVolumeInput = document.getElementById("musicVolume");
// const musicVolumeValueSpan = document.getElementById("musicVolumeValue");

const sfxVolumeInput = document.getElementById("sfxVolume");
const sfxVolumeValueSpan = document.getElementById("sfxVolumeValue");
const sfxTestButton = document.getElementById("sfxTestButton");

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
    sfxTestButton.addEventListener("click", playButtonClickSound);
    
    importSaveButton.addEventListener("click", () => {
        playButtonClickSound();
        const saveString = importSaveTextBox.value;
        importSave(saveString);
    });

    exportSaveButton.addEventListener("click", () => {
        playButtonClickSound();
        exportSave();
    });

    deleteSaveButton.addEventListener("click", () => {
        playButtonClickSound();
        deleteSave();
    });

    closeButton.addEventListener("click", () => {
        playButtonClickSound();
        hideSettings();
    });

    gameOverlay.addEventListener("click", hideSettings);

    settingsContainer.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    loadSettings(common.getGameState().savedSettings);

    // Make sure volumes are updated with loaded settings
    // updateMusicVolume();
    updateSFXVolume();

    /*
    musicVolumeInput.addEventListener("input", (event) => {
        const volume = event.target.value;
        musicVolumeValueSpan.textContent = `${volume}%`;
        common.getGameState().savedSettings.musicVolume = parseInt(volume);
        updateMusicVolume();
    });
    */
    sfxVolumeInput.addEventListener("input", (event) => {
        const volume = event.target.value;
        sfxVolumeValueSpan.textContent = `${volume}%`;
        common.getGameState().savedSettings.sfxVolume = parseInt(volume);
        updateSFXVolume();
    });

    thresholdInput.addEventListener("input", (event) => {
        const threshold = event.target.value;
        thresholdValueSpan.textContent = `${threshold}%`;
        common.getGameState().savedSettings.threshold = parseInt(threshold);
    });

    thresholdLabel.addEventListener("mouseover", (event) => {
        const tooltipText = `This setting will automatically pause the game if you're close to losing after being AFK. 
        The threshold will be active again when the resource that triggered it is double the threshold value. <br><br>
        
        Select the checkbox if you want it to apply this while the game is open as well.`;
        showCustomTooltip(tooltipText, event.clientX, event.clientY);
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
        const tooltipText = `This setting changes the apparent width of the game window, which affects the size of the buttons and help graphics.<br>
        Each panel will always be 1/4 of your actual screen width though.`;
        showCustomTooltip(tooltipText, event.clientX, event.clientY);
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
    /*
    musicVolumeInput.value = settingsData.musicVolume;
    musicVolumeValueSpan.textContent = `${settingsData.musicVolume}%`;
    common.savedSettings.musicVolume = settingsData.musicVolume;
    */
    sfxVolumeInput.value = settingsData.sfxVolume;
    sfxVolumeValueSpan.textContent = `${settingsData.sfxVolume}%`;
    common.savedSettings.sfxVolume = settingsData.sfxVolume;

    thresholdInput.value = settingsData.threshold;
    thresholdValueSpan.textContent = `${settingsData.threshold}%`;
    common.savedSettings.threshold = settingsData.threshold;
    thresholdAlwaysOnCheckbox.checked = settingsData.thresholdAlwaysOn;
    common.savedSettings.thresholdAlwaysOn = settingsData.thresholdAlwaysOn;

    windowSizeSelect.value = settingsData.windowSize;
    common.savedSettings.windowSize = settingsData.windowSize;

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

/*
function updateMusicVolume() {
    console.log(`"updated" music volume.`)
}
*/
function updateSFXVolume() {
    let volume = common.savedSettings.sfxVolume;
    buttonClickSound.volume = volume/100;
}