const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 12, paddleHeight = 80;
const ballRadius = 10;

let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 3;

let playerScore = 0, aiScore = 0;

// Listen for mouse movement to control player's paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Prevent paddle from going out of bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight); // Player (left)
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight); // AI (right)

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
    ctx.closePath();
}

// Move the ball and handle collisions
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY *= -1;
    }

    // Ball collision with left paddle
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add some "spin" based on where it hits the paddle
        let hitPoint = ballY - (playerY + paddleHeight / 2);
        ballSpeedY = hitPoint * 0.15;
    }

    // Ball collision with right paddle (AI)
    if (
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX *= -1;
        let hitPoint = ballY - (aiY + paddleHeight / 2);
        ballSpeedY = hitPoint * 0.15;
    }

    // Scoring
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Move AI paddle
    aiMove();

    // Update score display
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}

function aiMove() {
    // Simple AI: Move towards the ball
    let center = aiY + paddleHeight / 2;
    if (center < ballY - 10) {
        aiY += 4;
    } else if (center > ballY + 10) {
        aiY -= 4;
    }
    // Boundaries
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // Randomize direction
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3;
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();
