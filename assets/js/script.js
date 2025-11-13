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

    // Get all DOM elements
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
    let testActive = false;

    // Add difficulty options to select
    if (difficultySelect) {
        difficultySelect.innerHTML = `
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        `;
    }

    function getRandomText(textArray) {
        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

    function updateSampleText() {
        if (!difficultySelect) return;
        
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
        if (!sampleTextDiv) return;
        
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
        if (!userInput) return;
        
        const userText = userInput.value.trim();
        const userWords = userText.split(/\s+/);
        
        // Reset all word colors to default
        sampleWords.forEach((word, index) => {
            const wordSpan = document.getElementById(`word-${index}`);
            if (wordSpan) {
                wordSpan.style.color = '';
                wordSpan.style.fontWeight = '';
            }
        });
        
        // Color words based on user input
        userWords.forEach((userWord, index) => {
            if (index < sampleWords.length && userWord !== '') {
                const wordSpan = document.getElementById(`word-${index}`);
                if (wordSpan) {
                    if (userWord === sampleWords[index]) {
                        // Correct word - blue
                        wordSpan.style.color = '#007bff';
                        wordSpan.style.fontWeight = 'bold';
                    } else {
                        // Incorrect word - red
                        wordSpan.style.color = '#dc3545';
                        wordSpan.style.fontWeight = 'bold';
                    }
                }
            }
        });
    }

    function startTest() {
        if (!startButton || !stopButton || !retryButton || !userInput) return;
        
        startTime = new Date();
        testActive = true;
        
        startButton.disabled = true;
        stopButton.disabled = false;
        retryButton.disabled = true;
        userInput.disabled = false;
        userInput.value = '';
        userInput.focus();
        
        // Reset word colors
        updateWordColors();
    }

    function stopTest() {
        if (!testActive) return;
        
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        const wpm = calculateWPM(timeTaken);
        
        testActive = false;
        displayResults(timeTaken, wpm);

        if (startButton && stopButton && retryButton && userInput) {
            startButton.disabled = false;
            stopButton.disabled = true;
            retryButton.disabled = false;
            userInput.disabled = true;
        }
    }

    function retryTest() {
        startTime = null;
        endTime = null;
        testActive = false;
        
        if (startButton && stopButton && retryButton && userInput) {
            startButton.disabled = false;
            stopButton.disabled = true;
            retryButton.disabled = false;
            userInput.disabled = true;
            userInput.value = '';
        }
        
        updateSampleText();
        
        if (timeDisplay) timeDisplay.textContent = '0';
        if (wpmDisplay) wpmDisplay.textContent = '0';
    }

    function calculateWPM(timeTaken) {
        if (!userInput) return 0;
        
        const userText = userInput.value.trim();
        const userWords = userText.split(" ");
        
        let correctWords = 0;
        for (let i = 0; i < userWords.length && i < sampleWords.length; i++) {
            if (userWords[i] === sampleWords[i]) {
                correctWords++;
            }
        }
        
        return Math.round((correctWords / timeTaken) * 60);
    }

    function displayResults(timeTaken, wpm) {
        if (timeDisplay) timeDisplay.textContent = timeTaken.toFixed(2);
        if (wpmDisplay) wpmDisplay.textContent = wpm;
        if (levelDisplay && difficultySelect) {
            const selectedDifficulty = difficultySelect.value;
            levelDisplay.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
        }
    }

    // Event listeners
    if (difficultySelect) {
        difficultySelect.addEventListener('change', updateSampleText);
    }
    
    if (startButton) {
        startButton.addEventListener('click', startTest);
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', stopTest);
    }
    
    if (retryButton) {
        retryButton.addEventListener('click', retryTest);
    }
    
    // Add input event listener for live feedback
    if (userInput) {
        userInput.addEventListener('input', function() {
            if (testActive) {
                updateWordColors();
            }
        });
    }

    // Initialize
    updateSampleText();
});