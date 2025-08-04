// Handles various settings in the game (and opening/closing the menu)

import { addTooltip, buttonClickSound, playButtonClickSound, unselectCurrentActions } from "./buttons.js"; 
import { changeAutosaveInterval, saveGame, importSave, exportSave, deleteSave } from "./save.js";
import { restartClockCheck, stopClock, resetDayProgress } from "./time.js";
import { resetAllResearchProgress } from "./research.js";
import { resetAllTaskProgress } from "./tasks.js";
import common from "./common.js";
import { endRun } from "../game.js";

const gameOverlay = document.getElementById("gameOverlay");
const settingsContainer = document.getElementById("settingsContainer");

const restartWarning = settingsContainer.querySelector(".restart-warning");

const root = document.documentElement;

const vfxLabel = document.querySelector("label[for='vfxStrength']");
const vfxStrengthInput = document.getElementById("vfxStrength");
const vfxValueSpan = document.getElementById("vfxValue");
const vfxTestButton = document.getElementById("vfxTestButton");

// const musicVolumeInput = document.getElementById("musicVolume");
// const musicVolumeValueSpan = document.getElementById("musicVolumeValue");

const sfxLabel = document.querySelector("label[for='sfxVolume']");
const sfxVolumeInput = document.getElementById("sfxVolume");
const sfxVolumeValueSpan = document.getElementById("sfxVolumeValue");
const sfxTestButton = document.getElementById("sfxTestButton");

const autosaveLabel = document.querySelector("label[for='autosaveInterval']");
const autosaveIntervalInput = document.getElementById("autosaveInterval");
const autosaveIntervalValueSpan = document.getElementById("autosaveIntervalValue");

const thresholdInput = document.getElementById("threshold");
const thresholdValueSpan = document.getElementById("thresholdValue");
const thresholdLabel = document.querySelector("label[for='threshold']");
const thresholdAlwaysOnCheckbox = document.getElementById("thresholdAlwaysOn");

const windowSizeSelect = document.getElementById("emulateWindowSize");
const emulateWindowSizeLabel = document.querySelector("label[for='emulateWindowSize']");

const analButton = document.getElementById("analBtn");

const importSaveButton = settingsContainer.querySelector(".import-save-btn");
const importSaveTextBox = document.getElementById("importSaveTextBox");
const exportSaveButton = settingsContainer.querySelector(".export-save-btn");

const suicideButton = settingsContainer.querySelector(".suicide-btn");
const deleteSaveButton = settingsContainer.querySelector(".delete-save-btn");

const closeButton = document.getElementById("settingsCloseBtn");

let restartRequired = false;
let previousWidth;

const vfxTooltip = `Makes things more/less <b>glowy</b>. If you're reducing this because you're seeing frame drops, please consider buying new hardware instead.`;

const musicTooltip = ``;

const sfxTooltip = `Makes buttons more/less clicky. Doesn't affect your <i>actual</i> mouse or keyboard.`;

const autosaveTooltip = `How often the game saves for you. Gamers are so lazy these days.`;

const thresholdTooltip = `This setting will automatically pause the game if you're close to losing while the tab is hidden. 
The threshold will be active again when the resource that triggered it is double the threshold value. <br><br>

Select the checkbox if you want it to apply this while the game is open as well.`;

const emulateWindowTooltip = `Changes the apparent width of the game window, which affects the size of the tab buttons and help elements.<br>
Each panel will always be 1/4 of your actual window width though.<br>
This requires the game to restart (your progress will be saved first!), help elements may overlap if you emulate a very different window width to your true width.`;

const analTooltip = `Resets partial progress to 0 for all researches, tasks, and even the day.<br>
It's good if you like things to stay in sync.`;

const newAnalTooltip = `Just so you know, this is referred to as "analButton" in the code.`;

export function initialiseSettings() {
    sfxTestButton.addEventListener("click", playButtonClickSound);
    vfxTestButton.classList.add("newEntry");
    vfxTestButton.classList.add("unavailable-action");
    
    importSaveButton.addEventListener("click", () => {
        playButtonClickSound();
        const saveString = importSaveTextBox.value;
        importSave(saveString);
    });

    exportSaveButton.addEventListener("click", () => {
        playButtonClickSound();
        exportSave();
    });

    suicideButton.addEventListener("click", () => {
        playButtonClickSound();
        const reallyEnd = common.check(`Really commit suicide?`);
        if (reallyEnd) {
            const loadEarlier = common.check(`Do you want to start a new run? Or load an earlier save?`)
            if (loadEarlier) {
                // Load [secret] autosave? (X minutes ago)
                // Or import a save: [______]
                return;
            } else {
                endRun(true);
            }
        }
        
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

    // Make sure values are updated with loaded settings
    updateVFXStrength();
    // updateMusicVolume();
    updateSFXVolume();

    vfxStrengthInput.addEventListener("input", (event) => {
        const strength = event.target.value;
        vfxValueSpan.textContent = `${strength}%`;
        common.getGameState().savedSettings.vfxStrength = parseInt(strength);
        updateVFXStrength();
    });

    addTooltip(vfxLabel, vfxTooltip);
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

    addTooltip(sfxLabel, sfxTooltip);

    thresholdInput.addEventListener("input", (event) => {
        const threshold = event.target.value;
        thresholdValueSpan.textContent = `${threshold}%`;
        common.getGameState().savedSettings.threshold = parseInt(threshold);
    });

    addTooltip(thresholdLabel, thresholdTooltip);

    addTooltip(autosaveLabel, autosaveTooltip);

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

    addTooltip(emulateWindowSizeLabel, emulateWindowTooltip);

    analButton.addEventListener("click", () => {
        buttonClickSound.play();
        unselectCurrentActions();
        resetDayProgress();
        resetAllResearchProgress();
        resetAllTaskProgress();

        analButton.innerText = "Reset!";
    });

    analButton.addEventListener("mouseover", handleAnalButtonTooltip);
    analButton.addEventListener("mousemove", handleAnalButtonTooltip);
    analButton.addEventListener("mouseout", hideCustomTooltip);

    autosaveIntervalInput.addEventListener("input", (event) => {
        const interval = event.target.value;
        autosaveIntervalValueSpan.textContent = interval === "0" ? "Never" : `${interval} s`;
        common.getGameState().savedSettings.autosaveInterval = parseInt(interval);
    });

    document.addEventListener("keydown", handleEscapeKey);
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
    analButton.innerText = "I Like Things to be in Sync";

    changeAutosaveInterval(common.getGameState().savedSettings.autosaveInterval);
    importSaveTextBox.value = "";
    if (restartRequired) {
        saveGame();
        location.reload();
    } else {
        restartClockCheck();
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        if (settingsContainer.classList.contains('active')) {
            hideSettings();
        } else {
            showSettings();
        }
    }
}

function handleAnalButtonTooltip(event) {
    if (analButton.innerText === "Reset!") {
        showCustomTooltip(newAnalTooltip, event.clientX, event.clientY);
    } else {
        showCustomTooltip(analTooltip, event.clientX, event.clientY);
    }
}

function updateVFXStrength() {
    let strength = common.savedSettings.vfxStrength;
    root.style.setProperty('--vfx-intensity', strength / 100);
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

const customTooltip = document.getElementById("customTooltip");

function showCustomTooltip(message, x, y) {
    if (!customTooltip) {
        return;
    }
    customTooltip.innerHTML = message;
    // Position it slightly offset from the mouse cursor
    customTooltip.style.left = `${15 + x}px`;
    customTooltip.style.top = `${15 + y}px`;
    customTooltip.style.opacity = 1;
    customTooltip.style.visibility = "visible";
    customTooltip.style.transform = "translateY(0)";
}

function hideCustomTooltip() {
    if (!customTooltip) {
        return;
    }
    customTooltip.style.opacity = 0;
    customTooltip.style.visibility = "hidden";
    customTooltip.style.transform = "translateY(-5px)";
}