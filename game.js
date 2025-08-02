import { addMainListeners, updateTabButtons } from "./scripts/buttons.js";
import { updateResources } from "./scripts/resources.js";
import { updateResearches } from "./scripts/research.js";
import { updateTasks } from "./scripts/tasks.js";
import { restartClockCheck, updateDate } from "./scripts/time.js";
import { initialiseJournal } from "./scripts/journal.js";
import { initialiseSettings } from "./scripts/settings.js";
import { changeAutosaveInterval, loadGame } from "./scripts/save.js";
import common from "./scripts/common.js";

export function startGame() {

    const loadingScreen = document.getElementById('loading-screen');
    const minimumDisplayTime = 500;

    const minTimePromise = new Promise(resolve => setTimeout(resolve, minimumDisplayTime));
    
    const gameInitPromise = new Promise(resolve => {
        window.onload = () => {

            common.tabSize = parseInt(common.savedSettings.windowSize) / 30;
            addMainListeners(); // Has to be done before loading, creates top bar and tab buttons

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

            updateTabButtons("researchTabs");
            updateTabButtons("taskTabs");
            initialiseJournal();
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