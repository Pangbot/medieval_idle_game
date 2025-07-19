import common from './common.js';
import { addMainListeners } from './buttons.js';
import { updateTasks } from './tasks.js';
import { updateResearches } from './research.js';
import { updateDate } from './time.js';
import { updateResources } from './resources.js';

export function startGame() {
    
    common.unpauseGame();
    addMainListeners();
    updateDate();
    updateResources();
    updateResearches();
    updateTasks();

    console.log("Loaded!");
}