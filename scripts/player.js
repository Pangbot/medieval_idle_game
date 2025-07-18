// Handles the player's resources and stats

let player = {
    age: null,
    day: 0,
    selectedTask: null,
    selectedResearch: null,
    researched: new Set(),
    money: 0,
    health: 100,
    motivation: 100,
    DBH: 0
};

function loadPlayer(data) {
    player = data
}

function adjustResource(resource, amount) { 
    if (resource in player) {
        player[resource] += amount;
    }
    else {
        console.log(`Resource ${resource} not found in player struct (${player}).`)
    }
}

function changeTask(task) {
    player.selectedTask = task;
}

function changeResearch(research) {
    player.selectedResearch = research;
}

function addResearched(research) {
    player.researched.add(research)
}

export { player, loadPlayer, adjustResource, changeTask, changeResearch, addResearched };