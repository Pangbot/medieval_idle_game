// A place for global variables and associated functions.
import { player, loadPlayer } from "./player.js";
import { updateResources } from "./resources.js";
import { availableResearches, loadResearches, currentResearchTab, loadCurrentResearchTab } from "./research.js";
import { availableTasks, loadTasks, currentTaskTab, loadCurrentTaskTab } from "./tasks.js";
import { journal, loadJournal } from "./journal.js";
import { allResearches } from "./data/researchList.js";
import { allTasks } from "./data/taskList.js";
import { loadSettings } from "./settings.js";
import { updateDate } from "./time.js";

const researchMap = new Map(allResearches.map(research => [research.id, research]));
const taskMap = new Map(allTasks.map(task => [task.id, task]));
const defaultTabSize = 64;

const common = {
    dayInMilliseconds: 1000,
    unlockedDBH: false,
    tabSize: defaultTabSize,
    researchMap,
    taskMap,
    savedSettings: { // Default settings
        musicVolume: 0,
        sfxVolume: 80,
        threshold: 10,
        thresholdAlwaysOn: false,
        autosaveInterval: 30,
        windowSize: screen.width
    },

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
            savedSettings: this.savedSettings
        }
    },

    setGameState(state) {
        if (Array.isArray(state.player.completed)) {
            state.player.completed = new Set(state.player.completed);
        }
        else if (typeof state.player.completed === 'object' && state.player.completed !== null && Object.keys(state.player.completed).length === 0) {
            state.player.completed = new Set();
        }
        else if (!(state.player.completed)) {
            state.player.completed = new Set();
        }

        this.tabSize = parseInt(state.savedSettings.windowSize) / 30;
        loadPlayer(state.player);
        this.setDBHUnlocked(state.unlockedDBH);
        updateDate();
        loadCurrentResearchTab(state.currentResearchTab);
        loadCurrentTaskTab(state.currentTaskTab);
        updateResources();
        loadResearches(state.availableResearches);
        loadTasks(state.availableTasks);
        loadJournal(state.journal);
        if (state.savedSettings) {
            Object.assign(this.savedSettings, state.savedSettings);
        }
        loadSettings(this.savedSettings);

        console.log("Loaded state.");
    },

    // Make custom notifications at some point
    notify(message) {
        alert(message);
    },

    check(message) {
        return confirm(message);
    }
}

common.tabSize = common.savedSettings.windowSize ? common.savedSettings.windowSize / 30 : defaultTabSize;

export default common;