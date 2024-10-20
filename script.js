document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const movesCount = document.getElementById('movesCount');
    const timer = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popupButton = document.getElementById('popupButton');

    const cardImages = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
    'images/4.png',
    'images/5.png',
    'images/6.png',
    'images/7.png',
    'images/8.png'
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameTimer;
    let seconds = 0;
    let maxTime = 120; // 2 minutes
    let gameStarted = false; // Flag to check if the game has started

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(image) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${image}" alt="Card Image">
                </div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        return card;
    }

    function startGame() {
        if (gameStarted) return; // Prevent restarting if the game is already started
        gameStarted = true;
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        movesCount.textContent = moves;
        timer.textContent = formatTime(seconds);
        popup.style.display = 'none'; // Hide popup if it’s shown

        const shuffledImages = shuffleArray([...cardImages, ...cardImages]);
        shuffledImages.forEach(image => {
            const card = createCard(image);
            cards.push(card);
            gameBoard.appendChild(card);
        });

        clearInterval(gameTimer);
        gameTimer = setInterval(updateTimer, 1000);
    }

    function flipCard() {
        if (!gameStarted || flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return; // Prevent flipping if the game hasn't started or if two cards are already flipped
        }
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesCount.textContent = moves;
            setTimeout(checkMatch, 500);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const img1 = card1.querySelector('img').src;
        const img2 = card2.querySelector('img').src;

        if (img1 === img2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            setTimeout(() => {
                card1.style.opacity = '0';
                card2.style.opacity = '0';
            }, 1000);

            if (matchedPairs === cardImages.length) {
                clearInterval(gameTimer);
                setTimeout(() => {
                    showPopup('Congratulations!', `You won in ${moves} moves and ${formatTime(seconds)}!`, 'Play Again');
                }, 1500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        flippedCards = [];
    }

    function updateTimer() {
        seconds++;
        timer.textContent = formatTime(seconds);

        if (seconds >= maxTime) {
            clearInterval(gameTimer);
            showPopup('Time\'s Up!', 'You ran out of time. Try again!', 'Try Again');
        }
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function showPopup(title, message, buttonText) {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupButton.textContent = buttonText;
        popup.style.display = 'flex';
        gameStarted = false; // Reset the game status
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        gameStarted = false;
        startGame();
    });
    popupButton.addEventListener('click', () => {
        popup.style.display = 'none';
        gameStarted = false;
        startGame();
    });
});
