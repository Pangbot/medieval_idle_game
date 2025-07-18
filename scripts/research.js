// Handles the research area
import { changeResearch, addResearched, adjustResource } from "./player.js"

let allResearch = {
    test: "bleh"
}

let availableResearch = {

}

function loadResearch(data) {
    availableResearch = data
}

export { availableResearch, loadResearch }