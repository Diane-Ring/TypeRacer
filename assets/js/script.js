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

// Initialize with easy text when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set initial text
    const initialText = getRandomText('easy');
    displayText(initialText);
    
    // Add event listener to difficulty dropdown
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', updateTextForDifficulty);
    }
});