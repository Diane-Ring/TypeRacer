// Sample texts for each difficulty level
const sampleTexts = {
    easy: [
        "The cat sat on the mat. It was a sunny day.",
        "I like to eat cake and ice cream on my birthday.",
        "The dog runs fast in the park with his owner."
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog near the old wooden fence.",
        "Technology has revolutionized the way we communicate and work in modern society.",
        "Learning to type quickly and accurately requires consistent practice and dedication."
    ],
    hard: [
        "Extraordinarily complex algorithms facilitate sophisticated computational processes, enabling unprecedented technological advancement.",
        "The juxtaposition of traditional methodologies with contemporary innovations necessitates comprehensive evaluation protocols.",
        "Phenomenological investigations require meticulous documentation and systematic analysis of empirical observations."
    ]
};

// Timer variables
let startTime = null;
let isTestActive = false;
let currentSampleText = ""; // Store the current sample text for comparison

// Function to get random text based on difficulty
function getRandomText(difficulty) {
    const texts = sampleTexts[difficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

// Function to display text in the sample text area
function displayText(text) {
    const sampleTextElement = document.getElementById('sample-text');
    if (sampleTextElement) {
        sampleTextElement.textContent = text;
        currentSampleText = text; // Store the current text for WPM calculation
    }
}

// Function to update text based on difficulty selection
function updateTextForDifficulty() {
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        const selectedDifficulty = difficultySelect.value;
        const newText = getRandomText(selectedDifficulty);
        displayText(newText);
    }
}

// Function to calculate correctly typed words
function calculateCorrectWords(userText, sampleText) {
    // Split both texts into words, removing extra whitespace
    const userWords = userText.trim().split(/\s+/);
    const sampleWords = sampleText.trim().split(/\s+/);
    
    let correctWords = 0;
    
    // Compare each word up to the length of the shorter array
    const minLength = Math.min(userWords.length, sampleWords.length);
    
    for (let i = 0; i < minLength; i++) {
        if (userWords[i] === sampleWords[i]) {
            correctWords++;
        }
    }
    
    return correctWords;
}

// Function to calculate Words Per Minute (WPM)
function calculateWPM(correctWords, timeInMinutes) {
    if (timeInMinutes === 0) return 0;
    return Math.round(correctWords / timeInMinutes);
}

// Function to update the WPM display
function updateWPMDisplay(wpm) {
    const wpmElement = document.getElementById('wpm');
    if (wpmElement) {
        wpmElement.textContent = wpm;
    }
}

// Function to start the typing test
function startTypingTest() {
    if (!isTestActive) {
        startTime = new Date().getTime();
        isTestActive = true;
        
        // Enable user input and clear previous text
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.disabled = false;
            userInput.placeholder = "Start typing here...";
            userInput.value = "";
            userInput.focus();
        }
        
        // Update button states
        updateButtonStates();
        
        // Reset displays
        updateTimeDisplay(0);
        updateWPMDisplay(0);
    }
}

// Function to stop the typing test
function stopTypingTest() {
    if (isTestActive) {
        const endTime = new Date().getTime();
        const totalTimeInSeconds = (endTime - startTime) / 1000;
        const totalTimeInMinutes = totalTimeInSeconds / 60;
        
        isTestActive = false;
        
        // Get user input text for WPM calculation
        const userInput = document.getElementById('user-input');
        let userText = "";
        if (userInput) {
            userText = userInput.value;
            userInput.disabled = true;
        }
        
        // Calculate WPM
        const correctWords = calculateCorrectWords(userText, currentSampleText);
        const wpm = calculateWPM(correctWords, totalTimeInMinutes);
        
        // Update button states
        updateButtonStates();
        
        // Display final results
        updateTimeDisplay(totalTimeInSeconds);
        updateWPMDisplay(wpm);
    }
}

// Function to retry the typing test
function retryTypingTest() {
    // Reset test state
    isTestActive = false;
    startTime = null;
    
    // Clear and disable user input
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.disabled = true;
        userInput.placeholder = "Click the start button to begin the test";
        userInput.value = "";
    }
    
    // Generate new text based on current difficulty
    updateTextForDifficulty();
    
    // Update button states
    updateButtonStates();
    
    // Reset displays
    updateTimeDisplay(0);
    updateWPMDisplay(0);
}

// Function to update button enabled/disabled states
function updateButtonStates() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    
    if (startBtn && stopBtn && retryBtn) {
        if (isTestActive) {
            // Test is running
            startBtn.disabled = true;
            stopBtn.disabled = false;
            retryBtn.disabled = true;
        } else {
            // Test is not running
            startBtn.disabled = false;
            stopBtn.disabled = true;
            retryBtn.disabled = false;
        }
    }
}

// Function to update the time display
function updateTimeDisplay(timeInSeconds) {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeInSeconds.toFixed(2);
    }
}

// Function to update the level display
function updateLevelDisplay() {
    const difficultySelect = document.getElementById('difficulty');
    const levelElement = document.getElementById('level');
    
    if (difficultySelect && levelElement) {
        const selectedDifficulty = difficultySelect.value;
        // Capitalize first letter
        const capitalizedDifficulty = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
        levelElement.textContent = capitalizedDifficulty;
    }
}

// Initialize with easy text when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial text
    const initialText = getRandomText('easy');
    displayText(initialText);
    
    // Initialize button states
    updateButtonStates();
    
    // Disable user input initially
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.disabled = true;
    }
    
    // Add event listener to difficulty dropdown
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', function() {
            updateTextForDifficulty();
            updateLevelDisplay();
        });
    }
    
    // Add event listeners to buttons
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const retryBtn = document.getElementById('retry-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTypingTest);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopTypingTest);
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', retryTypingTest);
    }
    
    // Initialize level display
    updateLevelDisplay();
});