// Handles the journal logic
import { entries } from "./data/journalEntries.js";
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
        const fullEntry = entries.find(entry => entry.id === entryID);
        if (fullEntry) {
            journalMap.set(entryID, fullEntry);
        } else {
            console.warn(`Attempted to map non-existent entry ID: ${entryID}`);
        }
    });

    updateJournal(); // In case of loading data
}

export let journal = {
    allRelevantEntries: [], // Only read from
    entriesInJournal: [],
    openPage: null,
};

export function loadJournal(data) {
    journal = data;
    updateJournal();
}

export function updateJournal() {
    const entriesToAdd = [];

    // Loop through filtered journal entries
    journal.allRelevantEntries.forEach(entryID => {
        // Skip entries already in the journal
        if (journal.entriesInJournal.includes(entryID)) {
            return;
        }

        const entry = journalMap.get(entryID);
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

        // Game doesn't meet this entry's conditions, continue
        if (!conditionsMet) {
            return;
        }
        else {
            entriesToAdd.push(entryID);
        }

    });

    // Add new entries to the journal
    if (entriesToAdd.length > 0) {
        entriesToAdd.forEach(entryID => {
            journal.entriesInJournal.push(entryID);
            const entry = journalMap.get(entryID);

            const buttonText = `Entry #` + journal.entriesInJournal.length + `: <b>` + entry.title + `</b>`;

            const entryButton = document.createElement("button");
            entryButton.innerHTML = buttonText;
            entryButton.classList.add("journal-item");
            entryButton.classList.add("newEntry");
            entryButton.id = entry.id;

            entryButton.addEventListener('click', () => {
                showJournalEntry(entryID);
            });

            journalEntriesContainer.appendChild(entryButton);
            console.log(`New journal entry: ${entryID}`);
        });
        startJournalGlow();
    }
}

export function showJournal() {
    stopClock();
    stopJournalGlow();
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

    entries.forEach(entry => {
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
    }

    entryTextContainer.classList.add("active");

    entryTextContainer.innerHTML = "";

    entryTextContainer.innerHTML = entry.text.replace(/\r?\n/g, '<br>');

    entry.read = true;

}

function hideJournalEntry() {
    entryTextContainer.classList.remove("active");
}