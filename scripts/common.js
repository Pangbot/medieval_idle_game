// A place for global variables and associated functions.
import { player, loadPlayer } from "./player.js";
import { updateResources } from "./resources.js";
import { allResearchesUpdated, loadResearches, currentResearchTab, loadCurrentResearchTab } from "./research.js";
import { allTasksUpdated, loadTasks, currentTaskTab, loadCurrentTaskTab } from "./tasks.js";
import { journal, loadJournal } from "./journal.js";
import { allResearches } from "./data/researchList.js";
import { allTasks } from "./data/taskList.js";
import { loadSettings } from "./settings.js";
import { dayProgress, updateDate } from "./time.js";

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
        vfxStrength: 100,
        // musicVolume: 0,
        sfxVolume: 80,
        threshold: 10,
        thresholdAlwaysOn: false,
        autosaveInterval: 0,
        windowSize: window.innerWidth
    },

    setDBHUnlocked(state) {
        this.unlockedDBH = state;
    },

    getGameState() {
        return {
            timestamp: Date.now(), // Don't think it's needed but nice to have
            dayProgress,
            player,
            unlockedDBH: this.unlockedDBH,
            currentResearchTab,
            currentTaskTab,
            allResearchesUpdated,
            allTasksUpdated,
            journal,
            savedSettings: this.savedSettings
        }
    },

    setGameState(state) { // Used to handle loading the game
        if (Array.isArray(state.player.completed)) {
            state.player.completed = new Set(state.player.completed);
        }
        else {
            state.player.completed = new Set();
        }

        this.tabSize = parseInt(state.savedSettings.windowSize) / 30;
        if (state.savedSettings) {
            Object.assign(this.savedSettings, state.savedSettings);
        }
        loadSettings(this.savedSettings);
        loadPlayer(state.player);
        this.setDBHUnlocked(state.unlockedDBH);
        updateDate(state.dayProgress);
        loadCurrentResearchTab(state.currentResearchTab);
        loadCurrentTaskTab(state.currentTaskTab);
        updateResources();
        loadResearches(state.allResearchesUpdated);
        loadTasks(state.allTasksUpdated);
        loadJournal(state.journal);

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