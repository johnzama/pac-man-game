const grid = document.querySelector('.grid');
const width = 20; // 20x20 grid
const layout = [
    // 0: empty, 1: wall, 2: dot, 3: pac-man
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1,
    1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
    1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

const squares = [];
let pacManCurrentIndex = 21; // Starting index for Pac-Man
let direction = 1; // Initial direction for Pac-Man
let score = 0;
let gameOver = false;

// Create the grid and add the squares
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);

        // Add classes based on layout array
        if (layout[i] === 0) {
            squares[i].classList.add('empty');
        } else if (layout[i] === 1) {
            squares[i].classList.add('wall');
        } else if (layout[i] === 2) {
            squares[i].classList.add('dot');
        } else if (layout[i] === 3) {
            squares[i].classList.add('pac-man');
        }
    }
}

createBoard();

// Move Pac-Man
function movePacMan(e) {
    if (gameOver) return;

    squares[pacManCurrentIndex].classList.remove('pac-man');

    switch (e.keyCode) {
        case 37: // left
            if (pacManCurrentIndex % width !== 0 && !squares[pacManCurrentIndex - 1].classList.contains('wall')) 
                pacManCurrentIndex -= 1;
            break;
        case 38: // up
            if (pacManCurrentIndex - width >= 0 && !squares[pacManCurrentIndex - width].classList.contains('wall')) 
                pacManCurrentIndex -= width;
            break;
        case 39: // right
            if (pacManCurrentIndex % width < width - 1 && !squares[pacManCurrentIndex + 1].classList.contains('wall')) 
                pacManCurrentIndex += 1;
            break;
        case 40: // down
            if (pacManCurrentIndex + width < width * width && !squares[pacManCurrentIndex + width].classList.contains('wall')) 
                pacManCurrentIndex += width;
            break;
    }

    squares[pacManCurrentIndex].classList.add('pac-man');
    dotEaten();
    checkForGameOver();
    checkForWin();
}

document.addEventListener('keydown', movePacMan);

// Eat the dots
function dotEaten() {
    if (squares[pacManCurrentIndex].classList.contains('dot')) {
        squares[pacManCurrentIndex].classList.remove('dot');
        score++;
        document.getElementById('score').textContent = score;
    }
}

// Ghost movement
const ghosts = [
    { name: 'blinky', startIndex: 348, currentIndex: 348, speed: 250, direction: 1 },
    { name: 'pinky', startIndex: 376, currentIndex: 376, speed: 400, direction: 1 }
];

function moveGhost(ghost) {
    const directions = [-1, +1, -width, +width];
    let ghostTimerId = setInterval(() => {
        let direction = directions[Math.floor(Math.random() * directions.length)];
        if (!squares[ghost.currentIndex + direction].classList.contains('wall') &&
            !squares[ghost.currentIndex + direction].classList.contains('ghost')) {
            squares[ghost.currentIndex].classList.remove(ghost.name, 'ghost');
            ghost.currentIndex += direction;
            squares[ghost.currentIndex].classList.add(ghost.name, 'ghost');
        }
        checkForGameOver();
    }, ghost.speed);
}

ghosts.forEach(ghost => moveGhost(ghost));

// Check for game over
function checkForGameOver() {
    if (squares[pacManCurrentIndex].classList.contains('ghost')) {
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('play-again').style.display = 'block';
        document.removeEventListener('keydown', movePacMan);
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        gameOver = true;
    }
}

// Check for win
function checkForWin() {
    if (!squares.some(square => square.classList.contains('dot'))) {
        document.getElementById('you-win').style.display = 'block';
        document.getElementById('play-again').style.display = 'block';
        document.removeEventListener('keydown', movePacMan);
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        gameOver = true;
    }
}

// Restart the game
function restartGame() {
    window.location.reload();
}

