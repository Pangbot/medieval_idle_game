// Handles the visual aspect of the resources panel
import { player } from "./player.js";
import common from "./common.js";
import { addUpGlowEffect, addDownGlowEffect } from "./animations.js";

export function updateResources() {
    updateMoneyDisplay();
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

function getResourceAmount(resourceName) {
    const resource = player.resources.find(resource => resource.name === resourceName);
    return resource.amount;
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

    // Create a map of existing inventory item elements
    const existingItemElements = {};
    inventoryContainer.querySelectorAll('.inventory-item').forEach(itemElement => {
        const name = itemElement.dataset.itemName;
        existingItemElements[name] = itemElement;
    });

    const currentInventoryState = {};

    for (let i = 5; i < player.resources.length; i++) {
        const item = player.resources[i];
        if (item.amount > 0) {
            let itemElement = existingItemElements[item.name];

            if (itemElement) {
                // Item already exists in inventory
                const oldAmount = parseFloat(itemElement.dataset.itemAmount);
                itemElement.textContent = `${item.name}: ${Math.floor(item.amount)}`;
                itemElement.dataset.itemAmount = item.amount;

                currentInventoryState[item.name] = oldAmount;
                delete existingItemElements[item.name];

                if (oldAmount < item.amount) {
                    addUpGlowEffect(itemElement);
                }
                else if (oldAmount > item.amount) {
                    addDownGlowEffect(itemElement);
                }
            } else {
                // Item is new to inventory
                itemElement = document.createElement("div");
                itemElement.classList.add("inventory-item");
                itemElement.textContent = `${item.name}: ${Math.floor(item.amount)}`;
                itemElement.dataset.itemName = item.name;
                itemElement.dataset.itemAmount = item.amount;

                inventoryContainer.appendChild(itemElement);

                currentInventoryState[item.name] = 0;
                addUpGlowEffect(itemElement);
            }
        }
    }

    for (const name in existingItemElements) {
        if (existingItemElements.hasOwnProperty(name)) {
            inventoryContainer.removeChild(existingItemElements[name]);
        }
    }
}