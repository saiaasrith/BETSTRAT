// popup.js

// Load settings, analytics, and feedback to display in the popup
function loadSettings() {
    chrome.storage.sync.get(['lossLimit', 'currentLosses', 'feedback', 'gameData'], (result) => {
        // Load and display loss limit
        document.getElementById('lossLimit').value = result.lossLimit || 5;
        updateAlertMessage(result.currentLosses);

        // Display feedback
        document.getElementById('feedbackMessage').textContent = result.feedback || 'No feedback yet.';

        // Calculate and display betting analytics
        if (result.gameData) {
            displayBettingAnalytics(result.gameData);
        }
    });
}

// Save settings when the user clicks the "Save Settings" button
document.getElementById('saveSettings').addEventListener('click', () => {
    let lossLimit = document.getElementById('lossLimit').value;
    chrome.storage.sync.set({ lossLimit: parseInt(lossLimit) }, () => {
        alert('Settings saved!');
    });
});

// Reset the current losses when the user clicks "Reset Loss Count"
document.getElementById('resetLosses').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'RESET_LOSSES' }, () => {
        alert('Loss count reset!');
        loadSettings();
    });
});

// Update the alert message based on current losses
function updateAlertMessage(currentLosses) {
    if (currentLosses > 0) {
        document.getElementById('alertMessage').textContent = `You have ${currentLosses} losses.`;
    } else {
        document.getElementById('alertMessage').textContent = '';
    }
}

// Display betting analytics
function displayBettingAnalytics(gameData) {
    let totalBets = 0;
    let totalWins = 0;
    let totalLosses = 0;

    gameData.forEach(game => {
        totalBets += game.betAmount;
        if (game.result === 'win') {
            totalWins += 1;
        } else if (game.result === 'loss') {
            totalLosses += 1;
        }
    });

    let averageBet = (totalBets / gameData.length).toFixed(2);

    document.getElementById('totalBets').textContent = totalBets;
    document.getElementById('averageBet').textContent = averageBet;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;
}

// Initialize the popup by loading the current settings, analytics, and feedback
loadSettings();
