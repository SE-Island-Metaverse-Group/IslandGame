var ctx = document.getElementById('game').getContext('2d');
var maxLoadProgress = 0;

function registerImageResource(imagePath, onLoadCallback) {
    let img = new Image();
    img.src = imagePath;
    img.onload = onLoadCallback;
    ++maxLoadProgress;
    return img;
}

// ======== < Load Static Resource > ========

var loadProgress = 0;

var increaseProgress = function() { ++loadProgress; }
var bg = registerImageResource("res/textures/Fisherman/bg.png", increaseProgress);
var fishImg = registerImageResource("res/textures/Fisherman/fish.png", increaseProgress);
var fingerImg = registerImageResource("res/textures/Fisherman/finger.png", increaseProgress);

// ======== < Interval Settings > ========

// Progress interval
var progressInterval;
// Render interval
var renderInterval;
// Update interval
var updateInterval;
// Clear all interval
function clearAllInterval() {
    clearInterval(progressInterval);
    clearInterval(renderInterval);
    clearInterval(updateInterval);
}

// ============ < G A M E > ============

// Window
var width = window.innerWidth - 15;
var height = window.innerHeight - 15;
document.getElementById('game').setAttribute('width', width);
document.getElementById('game').setAttribute('height', height);

// Fishes
const FISH_NUM = 8;
var fishes = [];

// Game
const FINGER_RENDER_SIZE = Math.floor(Math.sqrt(0.0035 * width * height));

function update() {
    fingerUpdate();
    for(let i = 0; i < fishes.length; ++i) {
        fishes[i].update();
    }
}

function render() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawFish();
    drawFinger();
    displayScore();
    // If win
    if(fishes.length == 0) {
        win(userid, Finger.score);
    }
}

function drawBackground() {
    ctx.drawImage(bg, 0, 0, width, height);
}

function drawFish() {
    for(let i = 0; i < fishes.length; ++i) {
        // Rotate
        ctx.translate(fishes[i].holdsFish.x, fishes[i].holdsFish.y);
        if (fishes[i].holdsFish.face == FISH_FACETO.RIGHT) ctx.scale(-1, 1);
        // Draw
        ctx.drawImage(fishImg, -0.5 * fishes[i].holdsFish.width, -0.5 * fishes[i].holdsFish.height, fishes[i].holdsFish.width, fishes[i].holdsFish.height);
        // Recover
        if (fishes[i].holdsFish.face == FISH_FACETO.RIGHT) ctx.scale(-1, 1);
        ctx.translate(-fishes[i].holdsFish.x, -fishes[i].holdsFish.y);
        // Draw Hitbox
        // ctx.strokeRect(fishes[i].holdsFish.hitbox.x, fishes[i].holdsFish.hitbox.y, fishes[i].holdsFish.hitbox.w, fishes[i].holdsFish.hitbox.h);
    }
}

function drawFinger() {
    // Finger
    let _angular = Math.sin(FINGER_ANGULAR_VELOCITY*DEGREE*Finger.t) * Math.PI * 0.5;
    ctx.translate(Finger.headX, Finger.headY);
    ctx.rotate(-_angular);
    ctx.drawImage(fingerImg, -0.5 * FINGER_RENDER_SIZE, -0.5 * FINGER_RENDER_SIZE, FINGER_RENDER_SIZE, FINGER_RENDER_SIZE);
    ctx.rotate(_angular);
    ctx.translate(-Finger.headX, -Finger.headY);
    // Line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Finger.x, Finger.y);
    ctx.lineTo(Finger.headX, Finger.headY);
    ctx.stroke();
}

function displayScore() {
    ctx.font = Math.floor(0.05 * height) + 'px Ubuntu';
    ctx.fillStyle = "#EEEEEE";
    ctx.fillText("Score:" + Finger.score, width * 0.02, height * 0.05);
    ctx.font = Math.floor(0.025 * height) + 'px Ubuntu';
    ctx.fillText("userid: " + userid, width * 0.02, height * 0.085);
}

function startGame() {
    clearAllInterval()
    fingerInit(width * 0.5, height * 0.15, distance(width * 0.5, height * 0.15, width, height) * 0.9);
    fishes = generateFish(width * 0.1, height * 0.3, width * 0.8, height * 0.6, FISH_NUM);
    renderInterval = setInterval(render, 30);
    updateInterval = setInterval(update, 30);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (userid == null) userid = "Fisher Man";
}

// Get start
Finger.score = 0;
// Loading ...
progressInterval = setInterval(function() {
    const MARGIN = 3;
    ctx.fillStyle = "#1780C6";
    ctx.fillRect(width * 0.31, height * 0.44, width * 0.38, height * 0.12);
    ctx.fillStyle = "#09577E";
    ctx.fillRect(width * 0.32, height * 0.46, width * 0.36, height * 0.08);
    ctx.fillStyle = "#61EAFF";
    // Use Math.max to avoid draw a rect with negative width.
    ctx.fillRect(width * 0.32 + MARGIN, height * 0.46 + MARGIN,
                 Math.max(0, width * 0.36 * (loadProgress / maxLoadProgress) - MARGIN * 2), height * 0.08 - MARGIN * 2);
    ctx.stroke();
    if (loadProgress >= maxLoadProgress) {
        startGame();
    }
}, 30);