// Handles saving and loading data
import common from './common.js';

export function saveGame() {
    let state = common.getGameState()
    localStorage.setItem("saveData", JSON.stringify(state))
    console.log("Game saved")
    console.log(state)
}

export function loadGame() {
    const raw = localStorage.getItem("saveData");
    console.log(raw)
    if (raw) {
        common.setGameState(JSON.parse(raw))
    }
    else {
        common.notify("No save found! :(")
    }
    
}