import { addMainListeners } from './buttons.js';
import { updateTasks } from './tasks.js';
import { updateResearches } from './research.js';
import { restartClockCheck, updateDate } from './time.js';
import { updateResources } from './resources.js';

export function startGame() {
    
    window.onload = () => {
        addMainListeners();
        updateDate();
        updateResources();
        updateResearches();
        updateTasks();
        restartClockCheck();

        console.log("Loaded!");
    };
    
}