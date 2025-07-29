// Handles the tasks panel
import { player, adjustResource, changeTask } from "./player.js"
import { allTasks, taskTabs } from "./data/taskList.js"
import { updateActionButtons, createActionButtons, updateTabButtons } from './buttons.js'
import common from "./common.js";
import { stopClock } from "./time.js";
import { updateResearches } from "./research.js";
import { updateAnimations, updateCompletionProgressBar } from "./animations.js";

export let currentTaskTab = taskTabs[0];
export let allTasksUpdated;
export let availableTasks = allTasks.filter(task => task.available === true);
let tasksInTab = availableTasks.filter(task => task.tab === currentTaskTab);

export function loadTasks(data) {
    const loadedTasksMap = new Map();
    data.forEach(loadedTask => {
        loadedTasksMap.set(loadedTask.id, loadedTask);
    });

    allTasks.forEach(task => {
        const matchingLoadedTask = loadedTasksMap.get(task.id);

        if (matchingLoadedTask) {
            Object.assign(task, matchingLoadedTask);
        }
    });
    
    allTasksUpdated = allTasks;
    availableTasks = allTasksUpdated.filter(task => task.available === true);
    tasksInTab = availableTasks.filter(task => task.tab === currentTaskTab);
    createTasks();
}

export function loadCurrentTaskTab(tab) {
    currentTaskTab = tab;
    changeTaskTab(tab);
    updateTabButtons("taskTabs");
    updateTasks();
}

export function updateTasks() {
    allTasks.forEach(task => {
        if (task.completed) {
            task.available = false;
            return;
        }

        if (task.requires === null) {
            task.available = true;
        } else {
            const allRequiredCompleted = task.requires.every(requiredID =>
                player.completed.has(requiredID)
            );
            task.available = allRequiredCompleted;
        }
    });
    allTasksUpdated = allTasks;
    availableTasks = allTasksUpdated.filter(task => task.available === true);
    tasksInTab = availableTasks.filter(task => task.tab === currentTaskTab);
    createTasks();
}

function createTasks() {
    const taskContainer = document.getElementById("taskBtns");
    taskContainer.innerHTML = '';
    createActionButtons("taskBtns", tasksInTab, "tasks");
}

export function changeTaskTab(targetTab) {
    if (!taskTabs.includes(targetTab)) {
        console.error(`Tab ${targetTab} not found in taskTabs (${taskTabs}).`)
    }

    if (currentTaskTab !== targetTab) {
            const tabsContainer = document.querySelector('#taskTabs');
    
            if (!tabsContainer) {
                console.error("Task tabs container not found.");
                return;
            }
    
            const oldTabObject = tabsContainer.querySelector('#' + currentTaskTab);
            const newTabObject = tabsContainer.querySelector('#' + targetTab);
    
            if (oldTabObject && oldTabObject.classList.contains('active-button')) {
                oldTabObject.classList.remove('active-button');
            }
    
            currentTaskTab = targetTab;
    
            if (newTabObject) {
                newTabObject.classList.add('active-button');
            } else {
                console.error(`New tab button '${targetTab}' not found.`);
            }
    
            updateTasks();
        }
}

export function updateTaskProgress() {
    const currentTask = common.taskMap.get(player.selectedTaskID);

    if (!currentTask) {
        console.error(`Selected task with ID '${player.selectedTaskID}' not found in taskMap.`);
        player.selectedTaskID = null;
        stopClock();
        return;
    }

    currentTask.progress += 1;

    if (currentTask.progress % currentTask.resourcePeriod == 0) {
        currentTask.resources.forEach(resourceObj => {
            adjustResource(resourceObj.name, resourceObj.amount);
        });
    }

    updateActionButtons("taskBtns", tasksInTab,"tasks");
    updateAnimations(player.selectedResearchID, currentTask);

    // Check if it's completable
    if (isValidCompletionTime(currentTask)) {
        updateCompletionProgressBar(currentTask);

        if (currentTask.progress >= currentTask.daysToComplete) {
            currentTask.completed = true;
            currentTask.available = false;

            player.completed.add(currentTask.id);
            availableTasks = availableTasks.filter(task => task.available === true);

            // Not exactly elegant, but does the job. Maybe make this more modular if multiple different tasks unlock things.
            if (currentTask.id === "examine_arrival_area") {
                common.setDBHUnlocked(true);
            }

            changeTask(null);
            updateTasks();
            updateResearches();
        }
    }
}

function isValidCompletionTime(currentTask) {
    if (currentTask.daysToComplete !== null && currentTask.daysToComplete !== Infinity) {
        return true
    }
    else {
        return false
    }
}

export function resetAllTaskProgress() {
    allTasks.forEach(task => {
        task.workProgress = 0;
    });
    updateTasks();
}