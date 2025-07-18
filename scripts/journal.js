// Handles the journal logic
import { entries } from './data/journalEntries.js'

let journal = {
    entriesDisplayed: [],
    openPage: 1
}

function loadJournal(data) {
  journal = data
}

export { journal, loadJournal }