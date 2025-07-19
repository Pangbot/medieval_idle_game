// Handles the visual aspect of the resources panel
import { player } from "./player.js"; // Ensure correct relative path

export function updateResources() {
    updateMoneyDisplay();
    updateBar("health", player.health, 100);
    updateBar("motivation", player.motivation, 100);
    updateBar("DBH", player.DBH, 1);
}

function updateMoneyDisplay() {
    const moneyElement = document.getElementById("money");
    if (!moneyElement) {
        console.error("Money display element with ID 'money' not found.");
        return;
    }

    let totalPence = player.money;

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
        console.error(`Bar fill element with ID '${resourceName}' not found.`);
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
        barFillElement.style.backgroundColor = 'purple';
    } else if (resourceName === "motivation" && percentage < 50) {
        barFillElement.style.backgroundColor = 'darkblue';
    } else if (resourceName === "motivation") {
        barFillElement.style.backgroundColor = 'lightblue';
    }

    // DBH formatting
    if (resourceName === "DBH" && percentage < 25) {
        barFillElement.style.backgroundColor = 'white';
    } else if (resourceName === "DBH" && percentage < 50) {
        barFillElement.style.backgroundColor = 'grey';
    } else if (resourceName === "DBH") {
        barFillElement.style.backgroundColor = 'black';
    }
}