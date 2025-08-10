import { player } from "./player.js";
import { playButtonClickSound } from "./buttons.js";

const startScreen = document.getElementById("start-screen");
const questionElement = document.getElementById("question");
const startBtnWrapper = document.getElementById("start-btn-wrapper");
const questions = ["How old are you?"];
let questionIndex = 0;

export function runStartScreen() {
    startScreen.classList.remove("hidden");

    questionElement.innerHTML = questions[questionIndex];

    let buttonHTMLs = [];

    switch (questionIndex) {
        case 0: 
            const ages = [`<div><b>Young Adult</b></div><br>`, `<div><b>Middle Age</b></div><br>`, `<div><b>Retired</b></div><br>`];
            const ageDescriptions = [
                `<div>You're in your prime, physically.<br>
                You may not know much,<br>but you're quick to use what you do learn.
                </div>
                <div>Others may see you as inexperienced,<br>which will make it harder to receive help.<br>
                They're right, of course. You are inexperienced.</div>
                <div>However, out of inexperience,<br>surprising innovation can be found.</div>
                
                <span style="color: #006400;"><b>Positives:</b></span>
                <ul><li>Unique research opportunities are available.</li>
                <li>Physical tasks take less toll on your health.</li>
                <li>You're less likely to get sick and recover quickly.</li></ul>

                <span style="color: #8B0000;"><b>Negatives:</b></span>
                <ul><li>Some of your ideas will be dead ends.</li>
                <li>Big projects take longer.</li>
                <li>Base research speed is slower.</li></ul>`,

                `<div>You're well established in the life you live.<br>
                You know what makes people tick,<br>
                and others turn to you for guidance and support.</div>
                
                <div>The relationships you can build so easily<br>
                are a great boon, but they can also be a burden.<br>
                As you develop these, you may get too comfortable.</div>
                <div>But sometimes you must compromise your desires<br>
                to maintain these connections.</div>
                
                <span style="color: #006400;"><b>Positives:</b></span>
                <ul><li>Unique opportunities from your connections.</li>
                <li>Big projects take less time.</li>
                <li>You're initially more motivated to get home.</li></ul>
                
                <span style="color: #8B0000;"><b>Negatives:</b></span>
                <ul><li>You will lose time to help others.</li>
                <li>Your motivation decreases as the years pass.</li>
                <li>It takes longer to acclimate to new places.</li></ul>`,

                `<div>You've learned a lot over the years.<br>
                Your body may not co-operate like it used to,<br>but your mind is as sharp as ever.</div>
                
                <div>Some will revere you as a wise sage,<br>others, a crackpot to be shunned.<br>
                The truth? Somewhere in-between.</div>
                <div>Whatever the case, and whatever you choose<br>to do, you do not have long.</div>
                
                <span style="color: #006400;"><b>Positives:</b></span>
                <ul><li>Unique opportunites by claiming to be a sage.</li>
                <li>Others will request less from you.</li>
                <li>Base research speed is faster.</li></ul>

                <span style="color: #8B0000;"><b>Negatives:</b></span>
                <ul><li>You're more likely to get sick and recover slowly.</li>
                <li>Physical tasks take a heavy toll on your health.</li>
                <li>Without modern medicine, you have less time.</li></ul>`
            ]
            for (let i = 0; i < ages.length; i++) {
                buttonHTMLs.push(ages[i] + ageDescriptions[i]);
            }
            break;
        case 1:

    }

    buttonHTMLs.forEach((buttonHTML, index) => {
        const button = document.createElement("button");
        button.classList.add("start-btn");
        button.id = `button-${index}`;

        button.addEventListener("click", () => {
            playButtonClickSound();
            showNextScreen(button.id);
        });

        button.innerHTML = buttonHTML;
        startBtnWrapper.appendChild(button);
    });
    
}

function showNextScreen(chosenButtonID) {
    switch (questionIndex) {
        case 0:
            
    }
    questionIndex += 1;
}