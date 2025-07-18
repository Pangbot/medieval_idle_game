// Handles the tasks area
import { changeTask, adjustResource } from "./player.js"
import { allTasks } from "./data/taskList.js"

let availableTasks = allTasks.filter(task => task.available === true);

function loadTasks(data) {
    availableTasks = data;
    createAvailableTasks();
}

function updateTaskList() {
    availableTasks = allTasks.filter(task => task.available === true);
    createAvailableTasks();
}

function createAvailableTasks() {
    const taskTabsContainer = document.getElementById("taskTabs");
    if (!taskTabsContainer) {
        console.error("Task tabs container not found!");
        return;
    }

    taskTabsContainer.innerHTML = '';

    availableTasks.forEach(task => {
        const button = document.createElement("button");

        button.textContent = task.buttonName;
        button.classList.add("task-button");
        button.dataset.taskId = task.id;
        button.title = task.description;

        button.addEventListener("click", () => {
            console.log(`Task button clicked: ${task.id}`);
            changeTask(task.id);
        });

        taskTabsContainer.appendChild(button);
    });
}

export { availableTasks, loadTasks, updateTaskList }