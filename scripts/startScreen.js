import { player } from "./player.js";
import { playButtonClickSound } from "./buttons.js";

const startScreen = document.getElementById("start-screen");
const questionElement = document.getElementById("question");
const startBtnWrapper = document.getElementById("start-btn-wrapper");
const firstPreferenceLabel = document.getElementById("first-preference-label");
const secondPreferenceLabel = document.getElementById("second-preference-label");
const thirdPreferenceLabel = document.getElementById("third-preference-label");
const fourthPreferenceLabel = document.getElementById("fourth-preference-label");
const firstPreferenceWrapper = document.getElementById("first-preference-wrapper");
const secondPreferenceWrapper = document.getElementById("second-preference-wrapper");
const thirdPreferenceWrapper = document.getElementById("third-preference-wrapper");
const fourthPreferenceWrapper = document.getElementById("fourth-preference-wrapper");
const confirmBtnWrapper = document.getElementById("confirm-btn-wrapper");
const questions = ["How old are you?", "What science do you know?", "What hobby do you pursue?"];
let questionIndex = 0;

export function showStartScreen() {
    startScreen.classList.remove("hidden");

    questionElement.classList.add("fade-out");
    questionElement.innerHTML = questions[questionIndex];

    let buttonHTMLs = [];
    let titles;
    let buttonDescriptions;

    switch (questionIndex) {
        case 0: 
            titles = [`<div><b>Young Adult</b></div><br>`, `<div><b>Middle Age</b></div><br>`, `<div><b>Retired</b></div><br>`];
            buttonDescriptions = [
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
            ];
            break;
        case 1:
            titles = [`<div><b>Biology</b></div><br>`, `<div><b>Chemistry</b></div><br>`, `<div><b>Physics</b></div><br>`];
            buttonDescriptions = [
                `<div>The science of life and living organisms.</div>
                
                <span style="color: #006400;"><b>Benefits:</b></span>
                <ul><li>You may pass yourself off as a doctor.</li>
                <li>Allows you to develop advanced medicines.</li>
                <li>You will recover from sickness quicker.</li></ul>`,

                `<div>The science of materials and reactions.</div>
                
                <span style="color: #006400;"><b>Benefits:</b></span>
                <ul><li>Any chemical-based creations will be more efficient.</li>
                <li>Allows you to develop advanced cleaning products.</li>
                <li>It is easier to sell products and methods.</li></ul>`,

                `<div>The science of energy, time, and space.</div>
                
                <span style="color: #006400;"><b>Benefits:</b></span>
                <ul><li>Big projects will require fewer materials.</li>
                <li>Allows you to develop advanced constructions.</li>
                <li>Time machine-related research will be quicker.</li></ul>`
            ];
            break;
        case 2:
            titles = [`<div><b>Artist</b></div><br>`, `<div><b>Linguist</b></div><br>`, `<div><b>Naturalist</b></div><br>`];
            buttonDescriptions = [
                `<div>You're a musician, storyteller, and a patron of the visual arts.</div>
                
                <span style="color: #006400;"><b>Unique interactions and ways to earn money.</b></span>`,

                `<div>Be it dialects, Deutsch, or Dansk, you pick up languages in a flash.</div>
                
                <span style="color: #006400;"><b>Unique interactions and ways to earn money.</b></span>`,

                `<div>No, not a nudist. You're both a lover of nature and handy with a bow.</div>
                
                <span style="color: #006400;"><b>Unique interactions and ways to earn money.</b></span>`
            ];
            break;
    }

    for (let i = 0; i < titles.length; i++) {
        buttonHTMLs.push(titles[i] + buttonDescriptions[i]);
    }

    buttonHTMLs.forEach((buttonHTML, index) => {
        const button = document.createElement("button");
        button.classList.add("start-btn");
        button.classList.add("fade-out");

        button.addEventListener("click", () => {
            playButtonClickSound();
            showNextScreen(index);
        });

        button.innerHTML = buttonHTML;
        startBtnWrapper.appendChild(button);
    });

    setTimeout(() => {
        questionElement.classList.remove("fade-out");
        const buttons = document.querySelectorAll(".start-btn");
        buttons.forEach(button => {
            button.classList.remove("fade-out");
        });
    }, 10); // Slight delay to ensure fading is synced
}

function showNextScreen(chosenButton) {
    const buttons = document.querySelectorAll(".start-btn");
    buttons.forEach(button => {
        button.classList.add("fade-out");
    });

    questionElement.classList.add("fade-out");

    setTimeout(() => {
        switch (questionIndex) {
            case 0:
                addAgeToPlayer(chosenButton);
                break;
            case 1:
                addScienceToPlayer(chosenButton);
                break;
            case 2:
                addHobbyToPlayer(chosenButton);
                break;
        }
        questionIndex += 1;
        startBtnWrapper.innerHTML = "";

        if (questionIndex < questions.length) {
            showStartScreen();
        }
        else {
            showPronounScreen();
        }
    }, 500);
}

function addAgeToPlayer(chosenButton) {
    switch (chosenButton) {
        case 0:
            player.stats.find(stat => stat.name === "age").value = "young";
            break;
        case 1:
            player.stats.find(stat => stat.name === "age").value = "middle";
            break;
        case 2:
            player.stats.find(stat => stat.name === "age").value = "retired";
            break;
    }
}

function addScienceToPlayer(chosenButton) {
    switch (chosenButton) {
        case 0:
            player.stats.find(stat => stat.name === "science").value = "biologist";
            break;
        case 1:
            player.stats.find(stat => stat.name === "science").value = "chemist";
            break;
        case 2:
            player.stats.find(stat => stat.name === "science").value = "physicist";
            break;
    }
}

function addHobbyToPlayer(chosenButton) {
    switch (chosenButton) {
        case 0:
            player.stats.find(stat => stat.name === "hobby").value = "artist";
            break;
        case 1:
            player.stats.find(stat => stat.name === "hobby").value = "linguist";
            break;
        case 2:
            player.stats.find(stat => stat.name === "hobby").value = "naturist";
            break;
    }
}

function showPronounScreen() {
    questionElement.classList.remove("fade-out");
    questionElement.innerHTML = `Finally, personalise your character.<br>
    <small><small>(This will not affect gameplay meaningfully.)</small></small>`

    firstPreferenceLabel.innerHTML = `<div>Gender identity</div>`
    let buttonHTMLs = [`Man`, `Woman`, `Nonbinary`];

    buttonHTMLs.forEach(buttonHTML => {
        const button = document.createElement("button");
        button.classList.add("preference-btn");

        button.addEventListener("click", () => {
            playButtonClickSound();
            handlePreferenceButton(button, firstPreferenceWrapper);
        });

        button.innerHTML = buttonHTML;
        firstPreferenceWrapper.appendChild(button);
    });

    secondPreferenceLabel.innerHTML = `<div>Pronouns</div>`
    buttonHTMLs = [`He/Him`, `She/Her`, `They/Them`];

    buttonHTMLs.forEach(buttonHTML => {
        const button = document.createElement("button");
        button.classList.add("preference-btn");

        button.addEventListener("click", () => {
            playButtonClickSound();
            handlePreferenceButton(button, secondPreferenceWrapper);
        });

        button.innerHTML = buttonHTML;
        secondPreferenceWrapper.appendChild(button);
    });

    thirdPreferenceLabel.innerHTML = `<div>Romantic preference</div>`
    buttonHTMLs = [`Men`, `Women`, `All`, `None`];

    buttonHTMLs.forEach(buttonHTML => {
        const button = document.createElement("button");
        button.classList.add("preference-btn");

        button.addEventListener("click", () => {
            playButtonClickSound();
            handlePreferenceButton(button, thirdPreferenceWrapper);
        });

        button.innerHTML = buttonHTML;
        thirdPreferenceWrapper.appendChild(button);
    });

    fourthPreferenceLabel.innerHTML = `<div>Reproductive capacity</div>`
    buttonHTMLs = [`Fertile (male)`, `Fertile (female)`, `Infertile`];

    buttonHTMLs.forEach(buttonHTML => {
        const button = document.createElement("button");
        button.classList.add("preference-btn");

        button.addEventListener("click", () => {
            playButtonClickSound();
            handlePreferenceButton(button, fourthPreferenceWrapper);
        });

        button.innerHTML = buttonHTML;
        fourthPreferenceWrapper.appendChild(button);
    });
}

function handlePreferenceButton(button, preferenceWrapper) {
    clearSelectedFromPreference(preferenceWrapper);
    button.classList.add("selected");
    if (allPreferencesSelected() && isNoConfirmButton()) {
        showConfirmButton();
    }
}

function clearSelectedFromPreference(preferenceWrapper) { // Loops over wrapper buttons, removes "selected" from each button
    const buttons = preferenceWrapper.querySelectorAll(".preference-btn");

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains("selected")) {
            buttons[i].classList.remove("selected");
        }
    }
}

function allPreferencesSelected() {
    const firstChosen = Array.from(firstPreferenceWrapper.querySelectorAll(".preference-btn")).some(button => button.classList.contains("selected"));
    const secondChosen = Array.from(secondPreferenceWrapper.querySelectorAll(".preference-btn")).some(button => button.classList.contains("selected"));
    const thirdChosen = Array.from(thirdPreferenceWrapper.querySelectorAll(".preference-btn")).some(button => button.classList.contains("selected"));
    const fourthChosen = Array.from(fourthPreferenceWrapper.querySelectorAll(".preference-btn")).some(button => button.classList.contains("selected"));

    return firstChosen && secondChosen && thirdChosen && fourthChosen;
}

function isNoConfirmButton() {
    return confirmBtnWrapper.innerHTML === ``;
}

function showConfirmButton() {
    const button = document.createElement("button");
    button.classList.add("preference-btn");
    button.innerHTML = `Confirm`;

    button.addEventListener("click", () => {
        playButtonClickSound();
    });

    confirmBtnWrapper.appendChild(button);
}