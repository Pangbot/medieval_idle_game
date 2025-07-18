import common from './common.js';
import { addMainListeners } from './buttons.js';
import { updateTaskList } from './tasks.js';

export function startGame() {
    console.log("Loaded!")

    addMainListeners()
    updateTaskList()

    if (!common.getIsPaused()) {
        common.pauseGame()
    }

}