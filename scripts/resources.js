// Handles the visual aspect of the resources panel
import { player } from "./player.js";
import common from "./common.js";
import { addGlowEffect } from "./animations.js";

export function updateResources() {
    updateMoneyDisplay();

    const getResourceAmount = (name) => {
        const resource = player.resources.find(resource => resource.name === name);
        return resource.amount;
    };

    updateBar("health", getResourceAmount("health"), 100);
    updateBar("motivation", getResourceAmount("motivation"), 100);

    // Check if DBH bar unlocked
    const dbhBarWrapper = document.getElementById("dbhBarContainerWrapper");
    if (dbhBarWrapper) {
        if (common.unlockedDBH) {
            dbhBarWrapper.removeAttribute("hidden");
            updateBar("DBH", getResourceAmount("DBH"), 1);
        } else {
            dbhBarWrapper.setAttribute("hidden", "true");
        }
    } else {
        console.error("DBH bar wrapper element with ID 'dbhBarContainerWrapper' not found.");
    }
    updateInventory();
}

function updateMoneyDisplay() {
    const moneyElement = document.getElementById("money");
    if (!moneyElement) {
        console.error("Money display element with ID 'money' not found.");
        return;
    }

    const moneyResource = player.resources.find(resource => resource.name === "money");
    let totalPence = moneyResource.amount;

    const pounds = Math.floor(totalPence / 240);
    totalPence %= 240;

    const shillings = Math.floor(totalPence / 12);
    const pence = totalPence % 12;

    moneyElement.innerText = `£${pounds} ${shillings}s ${pence}d`;
}

function updateBar(resourceName, currentValue, maxValue) {
    const barFillElement = document.getElementById(`${resourceName}BarFill`);
    const barTextElement = document.getElementById(`${resourceName}BarText`);

    if (!barFillElement) {
        console.error(`Bar fill element with ID '${resourceName}BarFill' not found.`);
        return;
    }

    const clampedValue = Math.max(0, Math.min(currentValue, maxValue));
    const percentage = (clampedValue / maxValue) * 100;

    barFillElement.style.width = `${percentage}%`;

    if (barTextElement) {
        if (maxValue === 100) {
            barTextElement.innerText = `${Math.floor(clampedValue)}/${maxValue}`;
        }
        else if (maxValue === 1) {
            barTextElement.innerText = `${clampedValue.toFixed(3)}/${maxValue}`;
        }
    }

    // Health formatting
    if (resourceName === "health" && percentage < 25) {
        barFillElement.style.backgroundColor = 'red';
    } else if (resourceName === "health" && percentage < 50) {
        barFillElement.style.backgroundColor = 'orange';
    } else if (resourceName === "health") {
        barFillElement.style.backgroundColor = 'green';
    }

    // Motivation formatting
    if (resourceName === "motivation" && percentage < 25) {
        barFillElement.style.backgroundColor = 'red';
    } else if (resourceName === "motivation" && percentage < 50) {
        barFillElement.style.backgroundColor = 'orange';
    } else if (resourceName === "motivation") {
        barFillElement.style.backgroundColor = 'green';
    }

    // DBH formatting
    if (resourceName === "DBH" && percentage < 50) {
        barFillElement.style.backgroundColor = 'green';
    } else if (resourceName === "DBH" && percentage < 75) {
        barFillElement.style.backgroundColor = 'orange';
    } else if (resourceName === "DBH") {
        barFillElement.style.backgroundColor = 'red';
    }
}

function updateInventory() {
    if (player.resources.length < 6) {
        return;
    }
    const inventoryContainer = document.querySelector(".inventory-items");
    if (!inventoryContainer) {
        console.error("Inventory container element with class 'inventory-items' not found.");
        return;
    }

    // Record current inventory state for comparison later
    const currentInventoryState = {};
    inventoryContainer.querySelectorAll('.inventory-item').forEach(itemElement => {
        const name = itemElement.dataset.itemName;
        const amount = parseFloat(itemElement.dataset.itemAmount);
        currentInventoryState[name] = amount;
    });

    inventoryContainer.innerHTML = '';

    for (let i = 5; i < player.resources.length; i++) {
        const item = player.resources[i];
        
        const itemElement = document.createElement("div");
        itemElement.classList.add("inventory-item");
        itemElement.textContent = `${item.name}: ${Math.floor(item.amount)}`;
        itemElement.dataset.itemName = item.name;
        itemElement.dataset.itemAmount = item.amount;

        inventoryContainer.appendChild(itemElement);

        // Glow if the item is new or its amount has changed
        if (!currentInventoryState[item.name] || currentInventoryState[item.name] !== item.amount) {
            addGlowEffect(itemElement);
        }
    }
}