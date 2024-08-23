// background.js

let lossLimit = 0;
let currentLosses = 0;
let gameData = [];

// Initialize the extension
function initializeExtension() {
    chrome.storage.sync.get(['lossLimit'], (result) => {
        lossLimit = result.lossLimit || 5; // Default loss limit is 5
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'GAME_DATA') {
            trackGameData(request.data);
        } else if (request.type === 'RESET_LOSSES') {
            resetLosses();
        }
    });
}

// Track game data
function trackGameData(data) {
    gameData.push(data);

    if (data.result === 'loss') {
        currentLosses += 1;
    }

    analyzeStrategies();
    checkLossLimit();
}

// Analyze gameplay strategies including bets
function analyzeStrategies() {
    let patterns = analyzePattern(gameData);
    let feedback = provideFeedback(patterns);
    console.log('Strategy Analysis Feedback:', feedback);

    chrome.storage.sync.set({ feedback });
}

// Check if loss limit is reached
function checkLossLimit() {
    if (currentLosses >= lossLimit) {
        sendAlert();
    }
}

// Send alert to the user
function sendAlert() {
    chrome.notifications.create('lossLimitReached', {
        type: 'basic',
        iconUrl: 'assets/icon.png',
        title: 'Loss Limit Reached',
        message: 'You have reached your loss limit. It is recommended to stop playing.',
        priority: 2
    });
}

// Reset the current losses (can be triggered via popup)
function resetLosses() {
    currentLosses = 0;
    chrome.storage.sync.set({ currentLosses });
}

// Analyze gameplay data to identify patterns and provide feedback
function analyzePattern(gameData) {
    let winPatterns = [];
    let lossPatterns = [];

    gameData.forEach(game => {
        if (game.result === 'win') {
            winPatterns.push({
                strategy: game.strategy,
                betAmount: game.betAmount
            });
        } else if (game.result === 'loss') {
            lossPatterns.push({
                strategy: game.strategy,
                betAmount: game.betAmount
            });
        }
    });

    return {
        wins: winPatterns,
        losses: lossPatterns
    };
}

// Provide feedback based on analysis
function provideFeedback(patterns) {
    let feedback = '';

    if (patterns.losses.length > patterns.wins.length) {
        feedback = 'You may want to reconsider your strategy. Here are some common patterns in your losses:';
        patterns.losses.forEach((loss, index) => {
            feedback += `\nLoss ${index + 1}: Strategy: ${JSON.stringify(loss.strategy)}, Bet: ${loss.betAmount}`;
        });
    } else {
        feedback = 'Your current strategy is working well. Keep up the good work!';
    }

    return feedback;
}

// Initialize the extension on load
initializeExtension();
