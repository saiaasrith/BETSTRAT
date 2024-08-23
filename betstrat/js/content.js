// content.js

// Capture game data including bet amount from the specified input field
function captureGameData() {
    let gameResult = detectGameResult(); // Custom function to detect game result
    let strategyData = captureStrategy(); // Custom function to capture strategy details
    let betAmount = detectBetAmount();   // Custom function to capture the bet amount from the input field

    let gameData = {
        result: gameResult,
        strategy: strategyData,
        betAmount: betAmount,
        timestamp: new Date().toISOString()
    };

    // Send the game data to the background script
    chrome.runtime.sendMessage({ type: 'GAME_DATA', data: gameData });
}

// Function to detect bet amount by reading from the input field
function detectBetAmount() {
    let betInputElement = document.getElementById('bet-input'); // Access the input element by its ID
    if (betInputElement) {
        let betValue = betInputElement.value.trim(); // Get the input value and trim any extra spaces
        return parseFloat(betValue) || 0; // Convert the input value to a number, defaulting to 0 if invalid
    }
    return 0; // Return 0 if the input field is not found or empty
}

// Function to detect game result (this needs customization)
function detectGameResult() {
    // Placeholder logic: Replace with actual logic to determine win/loss
    let random = Math.random();
    return random > 0.5 ? 'win' : 'loss';
}

// Function to capture strategy details (customize based on game)
function captureStrategy() {
    // Placeholder: Customize with actual strategy details from the game
    return {
        move1: 'attack',
        move2: 'defend',
        move3: 'retreat'
    };
}

// Attach event listener to the betting button
function attachBetListener() {
    let betButton = document.querySelector('thimbles-bottom__val'); // Assuming this is the betting button
    if (betButton) {
        betButton.addEventListener('click', captureGameData);
    }
}

// Monitor the game page for betting actions
function injectMonitor() {
    let gamePage = checkIfGamePage(); // Custom function to verify if the current tab is a game page

    if (gamePage) {
        attachBetListener(); // Attach listener to detect when bets are placed
    }
}

// Mock function to check if the current page is a game page
function checkIfGamePage() {
    return window.location.href.includes('india.1xbet.com');
}

// Initialize the content script
injectMonitor();
