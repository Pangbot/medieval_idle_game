// A place for global variables and associated functions.
import { player, loadPlayer } from './player.js';
import { availableResearch, loadResearch } from './research.js';
import { availableTasks, loadTasks } from './tasks.js';
import { journal, loadJournal } from './journal.js';

const common = {
    isPaused: true,

    getIsPaused() {
        return this.isPaused;
    },

    pauseGame() {
        this.isPaused = true;
    },

    unpauseGame() {
        this.isPaused = false;
    },

    getGameState() {
        return {
            player,
            availableResearch,
            availableTasks,
            journal
        }
    },

    setGameState(state) {
        loadPlayer(state.player)
        loadResearch(state.research)
        loadTasks(state.tasks)
        loadJournal(state.journal)
        console.log("Loaded state.")
    },

    // Make custom notification at some point
    notify(message) {
        alert(message)
    }
}

export default common;