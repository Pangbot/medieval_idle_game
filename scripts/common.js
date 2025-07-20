// A place for global variables and associated functions.
import { player, loadPlayer } from './player.js';
import { availableResearches, loadResearches, currentResearchTab, loadCurrentResearchTab } from './research.js';
import { availableTasks, loadTasks, currentTaskTab, loadCurrentTaskTab } from './tasks.js';
import { journal, loadJournal } from './journal.js';

const common = {
    dayInMilliseconds: 1000,
    unlockedDBH: false,

    setDBHUnlocked(state) {
        this.unlockedDBH = state;
    },

    getGameState() {
        return {
            player,
            unlockedDBH: this.unlockedDBH,
            currentResearchTab,
            currentTaskTab,
            availableResearches,
            availableTasks,
            journal,
        }
    },

    setGameState(state) {
        loadPlayer(state.player);
        this.setDBHUnlocked(state.unlockedDBH);
        loadCurrentResearchTab(state.currentResearchTab);
        loadCurrentTaskTab(state.currentTaskTab);
        loadResearches(state.availableResearches);
        loadTasks(state.availableTasks);
        loadJournal(state.journal);
        console.log("Loaded state.");
    },

    // Make custom notifications at some point
    notify(message) {
        alert(message)
    }
}

export default common;