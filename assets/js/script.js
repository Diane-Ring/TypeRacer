document.addEventListener('DOMContentLoaded', function () {
    const easyTexts = [
        "The cat sat on the mat.",
        "A quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore."
    ];

    const mediumTexts = [
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "A journey of a thousand miles begins with a single step."
    ];

    const hardTexts = [
        "It was the best of times, it was the worst of times.",
        "In the beginning God created the heavens and the earth.",
        "The only thing we have to fear is fear itself."
    ];

    const difficultySelect = document.getElementById('difficulty');
    const sampleTextDiv = document.getElementById('sample-text');
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const retryButton = document.getElementById('retry-btn');
    const timeDisplay = document.getElementById('time');
    const userInput = document.getElementById('user-input');
    const levelDisplay = document.getElementById('level');
    const wpmDisplay = document.getElementById('wpm');

    let startTime;
    let endTime;
    let currentSampleText = '';
    let sampleWords = [];

    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    function updateSampleText() {
        let selectedDifficulty = difficultySelect.value;
        let selectedText;

        if (selectedDifficulty === 'easy') {
            selectedText = getRandomText(easyTexts);
        } else if (selectedDifficulty === 'medium') {
            selectedText = getRandomText(mediumTexts);
        } else if (selectedDifficulty === 'hard') {
            selectedText = getRandomText(hardTexts);
        }

        currentSampleText = selectedText;
        sampleWords = selectedText.split(' ');
        displaySampleTextWithSpans();
    }

    function displaySampleTextWithSpans() {
        // Clear the sample text div
        sampleTextDiv.innerHTML = '';
        
        // Create spans for each word
        sampleWords.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.id = `word-${index}`;
            span.className = 'sample-word';
            sampleTextDiv.appendChild(span);
            
            // Add space after each word except the last one
            if (index < sampleWords.length - 1) {
                sampleTextDiv.appendChild(document.createTextNode(' '));
            }
        });
    }

    function updateWordColors() {
        const userText = userInput.value.trim();
        const userWords = userText.split(/\s+/);
        
        // Reset all word colors to default
        sampleWords.forEach((word, index) => {
            const wordSpan = document.getElementById(`word-${index}`);
            if (wordSpan) {
                wordSpan.style.color = '';
                wordSpan.style.backgroundColor = '';
            }
        });
        
        // Color words based on user input
        userWords.forEach((userWord, index) => {
            if (index < sampleWords.length) {
                const wordSpan = document.getElementById(`word-${index}`);
                if (wordSpan) {
                    if (userWord === sampleWords[index]) {
                        // Correct word - blue
                        wordSpan.style.color = '#007bff';
                        wordSpan.style.fontWeight = 'bold';
                    } else if (userWord !== '') {
                        // Incorrect word - red
                        wordSpan.style.color = '#dc3545';
                        wordSpan.style.fontWeight = 'bold';
                    }
                }
            }
        });
    }

    function startTest() {
        startTime = new Date();
        startButton.disabled = true;
        stopButton.disabled = false;
        retryButton.disabled = true;
        userInput.disabled = false;
        userInput.value = ''; // Clear the input area
        userInput.focus();
        
        // Reset word colors
        updateWordColors();
    }

    function stopTest() {
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        const wpm = calculateWPM(timeTaken);
        
        displayResults(timeTaken, wpm);

        startButton.disabled = false;
        stopButton.disabled = true;
        retryButton.disabled = false;
        userInput.disabled = true;
    }

    function retryTest() {
        // Reset test state
        startTime = null;
        endTime = null;
        
        // Reset buttons
        startButton.disabled = false;
        stopButton.disabled = true;
        retryButton.disabled = false;
        
        // Clear and disable user input
        userInput.disabled = true;
        userInput.value = '';
        userInput.placeholder = "Click the start button to begin the test";
        
        // Generate new text and reset colors
        updateSampleText();
        
        // Reset displays
        timeDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
    }

    function calculateWPM(timeTaken) {
        const sampleText = currentSampleText.trim();
        const userText = userInput.value.trim();
        const sampleWordsArray = sampleText.split(" ");
        const userWords = userText.split(" ");
    
        let correctWords = 0;
        for (let i = 0; i < userWords.length; i++) {
            if (userWords[i] === sampleWordsArray[i]) {
                correctWords++;
            }
        }
    
        return Math.round((correctWords / timeTaken) * 60);
    }

    function displayResults(timeTaken, wpm) {
        timeDisplay.textContent = timeTaken.toFixed(2);
        wpmDisplay.textContent = wpm;
        const selectedDifficulty = difficultySelect.value;
        levelDisplay.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
    }

    // Event listeners
    difficultySelect.addEventListener('change', updateSampleText);
    startButton.addEventListener('click', startTest);
    stopButton.addEventListener('click', stopTest);
    retryButton.addEventListener('click', retryTest);
    
    // Add input event listener for live feedback
    userInput.addEventListener('input', function() {
        if (!startButton.disabled) { // Only update colors when test is active
            updateWordColors();
        }
    });

    // Initialize with a random text from the default difficulty level
    updateSampleText();
});