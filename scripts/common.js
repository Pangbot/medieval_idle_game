// A place for global variables and associated functions.
import { player, loadPlayer } from './player.js';
import { availableResearches, loadResearches, currentResearchTab, loadCurrentResearchTab } from './research.js';
import { availableTasks, loadTasks, currentTaskTab, loadCurrentTaskTab } from './tasks.js';
import { journal, loadJournal } from './journal.js';

const common = {
    isPaused: true,
    dayInMilliseconds: 1000,

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
            currentResearchTab,
            currentTaskTab,
            availableResearches,
            availableTasks,
            journal,
        }
    },

    setGameState(state) {
        loadPlayer(state.player);
        loadCurrentResearchTab(state.currentResearchTab);
        loadCurrentTaskTab(state.currentTaskTab);
        loadResearches(state.availableResearches);
        loadTasks(state.availableTasks);
        loadJournal(state.journal);
        console.log("Loaded state.");
    },

    // Make custom notification at some point
    notify(message) {
        alert(message)
    }
}

export default common;