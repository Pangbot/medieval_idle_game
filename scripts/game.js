import { addMainListeners, updateTabButtons } from "./buttons.js";
import { updateResources } from "./resources.js";
import { updateResearches } from "./research.js";
import { updateTasks } from "./tasks.js";
import { restartClockCheck, updateDate } from "./time.js";
import { initialiseSettings } from "./settings.js";
import { changeAutosaveInterval, loadGame } from "./save.js";
import common from "./common.js";

export function startGame() {

    const loadingScreen = document.getElementById('loading-screen');
    const minimumDisplayTime = 500;

    const minTimePromise = new Promise(resolve => setTimeout(resolve, minimumDisplayTime));
    
    const gameInitPromise = new Promise(resolve => {
        window.onload = () => {

            common.tabSize = parseInt(common.savedSettings.windowSize) / 30;

            if (localStorage.getItem("saveData")) {
                console.log("Save data found, loading game...");
                loadGame();
                restartClockCheck();
            }
            else {
                updateDate();
                updateResources();
                updateResearches();
                updateTasks();
                restartClockCheck();
                changeAutosaveInterval();
            }

            addMainListeners();
            updateTabButtons("researchTabs");
            updateTabButtons("taskTabs");
            initialiseSettings();
            console.log("Loaded!");
            resolve();
        };
    });

    Promise.all([minTimePromise, gameInitPromise]).then(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.remove();
            }, { once: true });
        }
    });
}