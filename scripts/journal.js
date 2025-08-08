// Handles the journal logic
import { journalEntries } from "./data/journalEntries.js";
import { player } from "./player.js";
import { stopClock, restartClockCheck } from "./time.js";
import { playButtonClickSound } from "./buttons.js";

const journalButton = document.getElementById("journalBtn");
const gameOverlay = document.getElementById("gameOverlay");
const journalContainer = document.getElementById("journalContainer");
const journalEntriesContainer = document.getElementById("journalEntriesContainer");
const entryTextContainer = document.getElementById("entryTextContainer");
const closeButton = document.getElementById("journalCloseBtn");

let journalMap = new Map();

export let journal = {
    allRelevantEntries: [], // Only read from
    entriesInJournal: [],
    readEntries: [],
    openPage: null,
};

export function loadJournal(data) {
    journal = data;
    initialiseJournal();
}

export function initialiseJournal() {

    journalContainer.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    entryTextContainer.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    closeButton.addEventListener("click", () => {
        playButtonClickSound();
        hideJournal();
    });

    gameOverlay.addEventListener("click", hideJournal);
    gameOverlay.addEventListener("click", hideJournalEntry);

    if (journal.allRelevantEntries.length === 0) { // Only build journal if not present
        buildJournal();
    }
    else {
        console.log("Journal already built. Relevant entries:", journal.allRelevantEntries);
    }

    journal.allRelevantEntries.forEach(entryID => {
        const fullEntry = journalEntries.find(entry => entry.id === entryID);
        if (fullEntry) {
            journalMap.set(entryID, fullEntry);
        } else {
            console.warn(`Attempted to map non-existent entry ID: ${entryID}`);
        }
    });
    updateJournal();
}

export function updateJournal() {
    const entriesToAdd = [];

    // Loop through filtered journal entries
    journal.allRelevantEntries.forEach(entryID => {
        const entry = journalMap.get(entryID);
        const allEntryButtons = journalEntriesContainer.querySelectorAll("button");
        const isButtonAlreadyCreated = Array.from(allEntryButtons).some(button => button.id === entryID);
        
        // Add entries already in the journal if not present
        if (journal.entriesInJournal.includes(entryID)) {
            if (isButtonAlreadyCreated) { 
                return;
            }
            const indexOfNextEntry = allEntryButtons.length + 1;

            const buttonText = `Entry #` + indexOfNextEntry + `: <b>` + entry.title + `</b>`;

            const entryButton = document.createElement("button");
            entryButton.innerHTML = buttonText;
            entryButton.classList.add("journal-item");
            if (!journal.readEntries.includes(entryID)) {
                entryButton.classList.add("newEntry");
            }
            entryButton.id = entry.id;

            entryButton.addEventListener('click', () => {
                showJournalEntry(entryID);
            });

            journalEntriesContainer.appendChild(entryButton);
        }
        else {
            let conditionsMet = true;

            // Check if gameConditions met
            entry.gameConditions.every(condition => {
                const requiredValue = condition.value;
                let currentValue;

                // Fill out other conditions as I think of them :P
                // Maybe location when travel is implemented, for example?
                // Ooh, definitely certain tasks/researches completed, like examine arrival area.
                switch (condition.name) {
                    case "day":
                        currentValue = player.resources.find(resource => resource.name === "day");
                        if (currentValue < requiredValue) {
                            conditionsMet = false;
                        }
                        break;
                    default:
                        console.error(`${condition.name} not accounted for in updateJournal.`);
                }
            });

            // If conditions met, add to container
            if (conditionsMet) {
                entriesToAdd.push(entryID);
            }
        }

    });

    // Add new entries to the journal
    if (entriesToAdd.length > 0) {
        entriesToAdd.forEach(entryID => {
            journal.entriesInJournal.push(entryID);
            const entry = journalMap.get(entryID);
            const indexOfNextEntry = journalEntriesContainer.querySelectorAll("button").length + 1;

            const buttonText = `Entry #` + indexOfNextEntry + `: <b>` + entry.title + `</b>`;

            const entryButton = document.createElement("button");
            entryButton.innerHTML = buttonText;
            entryButton.classList.add("journal-item");
            entryButton.classList.add("newEntry");
            entryButton.id = entry.id;

            entryButton.addEventListener('click', () => {
                showJournalEntry(entryID);
            });

            journalEntriesContainer.appendChild(entryButton);
        });
        startJournalGlow();
    }

    const allEntryButtons = journalEntriesContainer.querySelectorAll("button");
    const allEntriesOpened = Array.from(allEntryButtons).every(button => journal.readEntries.includes(button.id));
    if (!allEntriesOpened && !journalButton.classList.contains("newEntry")) {
        startJournalGlow();
    }
}

export function showJournal() {
    stopClock();
    gameOverlay.classList.add("active");
    journalContainer.classList.add("active");
}

function hideJournal() {
    gameOverlay.classList.remove("active");
    journalContainer.classList.remove("active");
    restartClockCheck();
}

function buildJournal() {
    if (player.stats.some(stat => stat.value === null)) {
        console.error(`Not all player stats declared.`);
        player.stats.filter(stat => stat.value === null).forEach(stat => console.error(`${stat.name} is null.`));
        return;
    }

    journalEntries.forEach(entry => {
        if (!entry.playerConditions || entry.playerConditions.length === 0) {
            journal.allRelevantEntries.push(entry.id);
            return;
        }

        const playerConditionsMet = entry.playerConditions.every(condition => {
            const requiredValue = condition.value;
            const playerStat = player.stats.find(stat => stat.name === condition.name);

            return playerStat && playerStat.value === requiredValue;
        });

        // If all player conditions are met, add the entry ID to allRelevantEntries.
        if (playerConditionsMet) {
            journal.allRelevantEntries.push(entry.id);
        }
    });
    console.log("Journal built. Relevant entries:", journal.allRelevantEntries);
}

function startJournalGlow() {
    if (!(journalButton.classList.contains("newEntry"))) {
        journalButton.classList.add("newEntry");
    }
}

function stopJournalGlow() {
    if (journalButton.classList.contains("newEntry")) {
        journalButton.classList.remove("newEntry");
    }
}

function showJournalEntry(entryID) {
    const entry = journalMap.get(entryID);

    const entryButton = document.getElementById(entryID);
    if (entryButton.classList.contains("newEntry")) {
        entryButton.classList.remove("newEntry");
        journal.readEntries.push(entryID);
    }

    const allEntryButtons = journalEntriesContainer.querySelectorAll("button");
    const allEntriesOpened = Array.from(allEntryButtons).every(button => journal.readEntries.includes(button.id));
    if (allEntriesOpened) {
        stopJournalGlow();
    }

    entryTextContainer.classList.add("active");

    entryTextContainer.innerHTML = entry.text.replace(/\r?\n/g, '<br>');

}

function hideJournalEntry() {
    entryTextContainer.classList.remove("active");
}