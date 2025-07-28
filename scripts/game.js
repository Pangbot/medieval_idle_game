import { addMainListeners } from "./buttons.js";
import { updateResources } from "./resources.js";
import { updateResearches } from "./research.js";
import { updateTasks } from "./tasks.js";
import { restartClockCheck, updateDate } from "./time.js";
import { initialiseSettings } from "./settings.js";
import { changeAutosaveInterval, loadGame } from "./save.js";
import common from "./common.js";

export function startGame() {
    
    window.onload = () => {

        addMainListeners();
        initialiseSettings();
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

        
        console.log("Loaded!");
    };
}