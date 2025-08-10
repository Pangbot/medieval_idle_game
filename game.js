import { addMainListeners, updateTabButtons } from "./scripts/buttons.js";
import { updateResources } from "./scripts/resources.js";
import { updateResearches } from "./scripts/research.js";
import { updateTasks } from "./scripts/tasks.js";
import { getTrustedTimeOffset, addOfflineTime, restartClockCheck, updateDate } from "./scripts/time.js";
import { initialiseJournal } from "./scripts/journal.js";
import { initialiseSettings } from "./scripts/settings.js";
import { changeAutosaveInterval, loadGame, startSecretSaves } from "./scripts/save.js";
import common from "./scripts/common.js";
import { journalSchema, journalEntries } from "./scripts/data/journalEntries.js";
import { logSchema, logEntries } from "./scripts/data/logEntries.js";
import { researchSchema, allResearches } from "./scripts/data/researchList.js";
import { taskSchema, allTasks } from "./scripts/data/taskList.js";
import { runStartScreen } from "./scripts/startScreen.js";

export let globalTimeOffset;

export async function startGame() {

    const loadingScreen = document.getElementById('loading-screen');
    const minimumDisplayTime = 500;
    let hasSave; // Need to define it here for start screen condition lower

    const minTimePromise = new Promise(resolve => setTimeout(resolve, minimumDisplayTime));
    
    const gameInitPromise = new Promise(async (resolve) => {
        window.onload = async() => {
            globalTimeOffset = await getTrustedTimeOffset();

            common.tabSize = parseInt(common.savedSettings.windowSize) / 30;
            addMainListeners(); // Has to be done before loading, creates top bar and tab buttons
            runDataValidation(); // Checks all of the List/Entries files have the right format
            hasSave = null; //localStorage.getItem("saveData");

            if (hasSave) {
                console.log("Save data found, loading game...");
                const savedTimestamp = JSON.parse(hasSave).timestamp;
                
                loadGame();
                if(common.check("Simulate offline time?")) {
                    addOfflineTime(savedTimestamp); // Offset calculated in calculateOfflineTime()
                }
                restartClockCheck();
            }
            else {
                updateDate();
                updateResources();
                updateResearches();
                updateTasks();
                restartClockCheck();
                changeAutosaveInterval();
                initialiseJournal();
            }

            initialiseSettings();
            updateTabButtons("researchTabs");
            updateTabButtons("taskTabs");
            startSecretSaves();
            console.log("Loaded!");
            resolve();
        };
    });

    Promise.all([minTimePromise, gameInitPromise]).then(() => {
        if (!hasSave) {
            runStartScreen();
        }

        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.remove();
            }, { once: true });
        }

    });

}

export function endRun(suicide = false) { // Called on death/total loss of motivation
    console.log(`Run is over. :(`);
    if (!suicide) {
        // Player's already been warned, don't offer an earlier save
        const reallyEnd = common.check(`Do you accept this end? Or do you want to go back?`/*, `It's time.`,  `Send me back!` */);

        if(!reallyEnd) {
            // Load [secret] autosave? (X minutes ago)
            // Or import a save: [______]
            return;
        }
    }
    // End accepted
    // close any open menus/overlays
    // set read/available attributes from data files to false
    // run update functions? May not be necessary
    // newPrestige(); // prestige.js(?)
}

function runDataValidation() {
    const isJournalValid = validateData(journalEntries, [journalSchema], "journalEntries");
    const isLogValid = validateData(logEntries, [logSchema], "logEntries");
    const isResearchListValid = validateData(allResearches, [researchSchema], "allResearches");
    const isTaskListValid = validateData(allTasks, [taskSchema], "allTasks");

    if (isJournalValid && isLogValid && isResearchListValid && isTaskListValid) {
        console.log(`All data validated. :D`)
    } else {
        console.error(`Data validation failed. D:`);
    }
}

function validateData(dataList, schema, initialPath = 'root') {
    console.log(`Starting validation for data against schema:`, schema);
    const isValid = validateDataElement(dataList, schema, initialPath);
    if (isValid) {
        console.log("Validation successful!");
    } else {
        console.error("Validation failed. Check console for details.");
    }
    return isValid;
}

function validateDataElement(data, schema, path = 'root') {
    // If the schema value is "undefined", it means "any type"
    if (schema === undefined) {
        return true;
    }

    // Handle primitive types first (string, number, bool, null)
    if (typeof schema !== 'object' || schema === null) {
        // Special case for null, as typeof null is "object"
        if (schema === null) {
            if (data !== null) {
                console.error(`Validation Error at ${path}: Expected null, but got ${typeof data}.`);
                return false;
            }
        } else if (typeof data !== typeof schema) {
            console.error(`Validation Error at ${path}: Expected type '${typeof schema}', but got '${typeof data}'.`);
            return false;
        }
        return true;
    }

    // Handle arrays
    if (Array.isArray(schema)) {
        if (!Array.isArray(data)) {
            console.error(`Validation Error at ${path}: Expected an array, but got '${typeof data}'.`);
            return false;
        }

        // If schema specifies element structure (e.g., [{...}]), validate each data item
        if (schema.length > 0) {
            const elementSchema = schema[0]; // Take the first element as the schema for array items
            for (let i = 0; i < data.length; i++) {
                if (!validateDataElement(data[i], elementSchema, `${path}[${i}]`)) {
                    return false; // Error already logged
                }
            }
        }
        // If schema is an empty array [], it just means 'expect an array', no specific element type check.
        return true;
    }

    // Handle objects
    if (typeof schema === 'object' && schema !== null) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            console.error(`Validation Error at ${path}: Expected an object, but got '${typeof data}'.`);
            return false;
        }

        // Validate each property defined in the schema
        for (const key in schema) {
            if (schema.hasOwnProperty(key)) {
                const currentPath = `${path}.${key}`;
                if (!data.hasOwnProperty(key)) {
                    console.error(`Validation Error at ${currentPath}: Missing required property.`);
                    return false;
                }
                if (!validateDataElement(data[key], schema[key], currentPath)) {
                    return false; // Error already logged
                }
            }
        }

        // Check for extra properties in data not defined in schema
        for (const key in data) {
            if (data.hasOwnProperty(key) && !schema.hasOwnProperty(key)) {
                console.warn(`Validation Warning at ${path}.${key}: Unexpected property found.`);
            }
        }
        
        return true;
    }

    // Just in case
    console.error(`Validation Error: Unhandled schema type at ${path}. Schema:`, schema);
    return false;
}