// Handles the tasks area
import { changeTask, adjustResource } from "./player.js"
import { allTasks, taskTabs } from "./data/taskList.js"
import { createTabTaskButtons } from './buttons.js'

let currentTaskTab = taskTabs[0];
let availableTasks = allTasks.filter(task => task.available === true);
let tasksInTab = availableTasks.filter(task => task.tab === currentTaskTab);

function loadTasks(data) {
    availableTasks = data;
    createTabTasks();
}

function loadCurrentTaskTab(tab) {
    currentTaskTab = tab;
}

function updateTasks() {
    availableTasks = allTasks.filter(task => task.available === true);
    tasksInTab = availableTasks.filter(task => task.tab === currentTaskTab);
    createTabTasks();
}

function createTabTasks() {
    const taskInTabContainer = document.getElementById("taskInTabBtns");

    taskInTabContainer.innerHTML = '';

    createTabTaskButtons(taskInTabContainer, tasksInTab);
}

function changeTaskTab(targetTab) {
    if (!taskTabs.includes(targetTab)) {
        console.error(`Tab ${targetTab} not found in taskTabs (${taskTabs}).`)
    }

    if (!(currentTaskTab === targetTab)) {
        currentTaskTab = targetTab;
        updateTasks();
    }
}

export { availableTasks, loadTasks, loadCurrentTaskTab, updateTasks, currentTaskTab, changeTaskTab }