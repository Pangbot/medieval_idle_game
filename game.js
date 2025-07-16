





let gameState = {
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

let is_paused = false

function updateResearchBar() {
    console.log("research bar updated")
}

function updateResourceBars() {
    console.log("resource bars updated")
}

function updateTaskBar() {
    console.log("task bar updated")
}

export function startGame() {
    console.log("Loaded!")

    if (!is_paused) {
        updateResourceBars()
        updateResearchBar()
        updateTaskBar()
    }

}