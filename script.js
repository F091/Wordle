// script.js

// List of valid words for guessing and for target words
const wordBank = [
    // Common words
    "apple", "grape", "peach", "chair", "table", "house", "train", "plane", "glass", "shirt",
    "green", "black", "white", "brush", "light", "stone", "sweet", "water", "heart", "smile",
    "sound", "candy", "plant", "sleep", "phone", "thing", "music", "style", "frame", "touch",
    "point", "clear", "taste", "scent", "flame", "shine", "child", "space", "world", "storm",

    // Less common words
    "fjord", "nymph", "glyph", "quilt", "whisk", "plumb", "scion", "mirth", "brisk", "glaze",
    "plume", "blaze", "lunar", "azure", "froze", "quark", "crisp", "sloop", "wharf", "gripe",
    "gaunt", "knoll", "blurt", "stilt", "graft", "twine", "snarl", "quasi", "plush", "baste",
    "shrub", "flint", "swine", "crave", "heist", "slink", "glide", "woozy", "clasp", "trope",

    // Rare words
    "adieu", "ivory", "glyph", "quasi", "vapid", "rogue", "opine", "brash", "junta", "exalt",
    "vigor", "quoth", "bleak", "sinew", "throb", "flair", "trove", "booze", "crypt", "moxie",
    "spiel", "vicar", "valor", "brine", "lithe", "mirth", "joust", "myrrh", "zesty", "folly",
    "plumb", "smirk", "flume", "brine", "hatch", "quash", "gloom", "quint", "crisp", "wrath",
    "slosh", "foyer", "mocha", "murky", "tryst", "aloft", "blurb", "shear", "prism", "proxy"
];

let targetWord = wordBank[Math.floor(Math.random() * wordBank.length)];
let attempts = 0;
let currentGuess = "";
const maxAttempts = 6;
const keyboardLayout = "qwertyuiopasdfghjklzxcvbnm";

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    createKeyboard();
    document.getElementById("restart-button").style.display = "none"; // Hide the restart button initially
});

function createBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = ""; // Clear the board for a new game
    for (let i = 0; i < maxAttempts * 5; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        board.appendChild(tile);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = ""; // Clear keyboard for a new game
    for (const key of keyboardLayout) {
        const keyElement = document.createElement("div");
        keyElement.classList.add("key");
        keyElement.textContent = key.toUpperCase();
        keyElement.addEventListener("click", () => handleKeyPress(key));
        keyboard.appendChild(keyElement);
    }
}

function handleKeyPress(key) {
    if (currentGuess.length < 5 && attempts < maxAttempts) {
        currentGuess += key;
        updateBoard();
    }
}

document.addEventListener("keydown", (e) => {
    if (/^[a-zA-Z]$/.test(e.key) && e.key.length === 1) {
        handleKeyPress(e.key.toLowerCase());
    } else if (e.key === "Enter") {
        submitGuess();
    } else if (e.key === "Backspace") {
        deleteLetter();
    }
});

function deleteLetter() {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
}

function updateBoard() {
    const board = document.getElementById("game-board");
    const rowStart = attempts * 5;
    for (let i = 0; i < 5; i++) {
        const tile = board.children[rowStart + i];
        tile.textContent = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) {
        showMessage("Please enter a 5-letter word.");
        return;
    }

    if (!wordBank.includes(currentGuess)) {
        showMessage("Word not in word bank.");
        return;
    }

    checkGuess();
    currentGuess = "";
    attempts++;

    if (attempts >= maxAttempts || currentGuess === targetWord) {
        document.getElementById("restart-button").style.display = "block"; // Show restart button
    }
}

function checkGuess() {
    const board = document.getElementById("game-board");
    const rowStart = attempts * 5;

    for (let i = 0; i < 5; i++) {
        const tile = board.children[rowStart + i];
        const letter = currentGuess[i];
        
        if (letter === targetWord[i]) {
            tile.classList.add("correct");
            updateKeyboard(letter, "correct");
        } else if (targetWord.includes(letter)) {
            tile.classList.add("present");
            updateKeyboard(letter, "present");
        } else {
            tile.classList.add("absent");
            updateKeyboard(letter, "absent");
        }
    }

    if (currentGuess === targetWord) {
        showMessage("Congratulations! You guessed the word!");
        disableInput();
    } else if (attempts === maxAttempts - 1) {
        showMessage(`Game over! The word was "${targetWord}".`);
        disableInput();
    }
}

function updateKeyboard(letter, status) {
    const keys = document.querySelectorAll(".key");
    keys.forEach((key) => {
        if (key.textContent.toLowerCase() === letter) {
            key.classList.add(status);
        }
    });
}

function showMessage(message) {
    document.getElementById("message").textContent = message;
}

function disableInput() {
    document.removeEventListener("keydown", handleKeyPress);
}

// Restart the game by resetting all game variables and UI elements
function restartGame() {
    attempts = 0;
    currentGuess = "";
    targetWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    document.getElementById("message").textContent = "";
    document.getElementById("restart-button").style.display = "none"; // Hide the restart button

    createBoard();   // Reset board
    createKeyboard(); // Reset keyboard
}
