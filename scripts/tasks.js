// Handles the tasks area
import { player, adjustResource, changeTask } from "./player.js"
import { allTasks, taskTabs } from "./data/taskList.js"
import { createTabTaskButtons } from './buttons.js'
import common from "./common.js";
import { stopClock } from "./time.js";
import { updateResearches } from "./research.js";
import { updateCompletionProgressBar } from "./animations.js";

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
    allTasks.forEach(task => {
            if (task.completed) {
                task.available = false;
                return;
            }
    
            if (task.requires === null) {
                task.available = true;
            } else {
                const allRequiredCompleted = task.requires.every(requiredId =>
                    player.completed.has(requiredId)
                );
                task.available = allRequiredCompleted;
            }
        });
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

function updateTaskProgress() {
    const currentTask = common.taskMap.get(player.selectedTaskID);

    if (!currentTask) {
        console.error(`Selected task with ID '${player.selectedTaskID}' not found in taskMap.`);
        player.selectedTaskID = null;
        stopClock();
        return;
    }

    currentTask.progress += 1;
    updateCompletionProgressBar(currentTask);

    if (currentTask.progress % currentTask.resourcePeriod == 0) {
        currentTask.resources.forEach(resourceObj => {
            adjustResource(resourceObj.name, resourceObj.amount);
        });
    }

    // Check if it's completable
    if (currentTask.daysToComplete) {
        if (currentTask.progress >= currentTask.daysToComplete) {
            currentTask.completed = true;
            currentTask.available = false;

            // Not exactly elegant, but does the job. Maybe make this more modular if multiple different tasks unlock things.
            if (currentTask.id === "examine_arrival_area") {
                common.setDBHUnlocked(true);
            }

            changeTask(null);
            updateTasks();
            updateResearches();
            stopClock();
        }
    }
}

export { availableTasks, loadTasks, loadCurrentTaskTab, updateTasks, currentTaskTab, changeTaskTab, updateTaskProgress }