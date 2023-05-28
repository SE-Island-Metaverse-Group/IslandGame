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
var bg = registerImageResource("res/textures/GoldMiner/bg.png", increaseProgress);
var goldImg = registerImageResource("res/textures/GoldMiner/Au.png", increaseProgress);
var treeImg = registerImageResource("res/textures/LLLLLogger/tree.png", increaseProgress);
var cutterImg = registerImageResource("res/textures/LLLLLogger/cutter.png", increaseProgress);

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

// Golds
const GOLD_NUM = 6;
var golds = [];

// Cutter
var bladeAngular = 0;

// Game
const CUTTER_RENDER_SIZE = Math.floor(Math.sqrt(0.005 * width * height));

function update() {
    cutterUpdate();
    bladeAngular += CUTTER_BLADE_ANGULAR_VELOCITY * DEGREE;
}

function render() {
    ctx.clearRect(0, 0, width, height);
    // drawBackground();
    drawGold();
    drawCutter();
    displayScore();
    // If win
    if(golds.length == 0) {
        win(userid, Cutter.score);
    }
}

function drawBackground() {
    ctx.drawImage(bg, 0, 0, width, height);
}

function drawGold() {
    for(let i = 0; i < golds.length; ++i) {
        // Rotate
        ctx.translate(golds[i].x, golds[i].y);
        ctx.rotate(golds[i].rotate);
        // Draw
        ctx.drawImage(goldImg, -0.5 * golds[i].scale, -0.5 * golds[i].scale, golds[i].scale, golds[i].scale);
        // Recover
        ctx.rotate(-golds[i].rotate);
        ctx.translate(-golds[i].x, -golds[i].y);
        // Draw Hitbox
        // ctx.beginPath()
        // ctx.arc(golds[i].hitbox.x, golds[i].hitbox.y, golds[i].hitbox.r, 0, 2*Math.PI)
        // ctx.fill()
    }
}

function drawCutter() {
    // Cutter
    ctx.translate(Cutter.headX, Cutter.headY);
    ctx.rotate(-bladeAngular);
    ctx.drawImage(cutterImg, -0.5 * CUTTER_RENDER_SIZE, -0.5 * CUTTER_RENDER_SIZE, CUTTER_RENDER_SIZE, CUTTER_RENDER_SIZE);
    ctx.rotate(bladeAngular);
    ctx.translate(-Cutter.headX, -Cutter.headY);
    // Line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(Cutter.x, Cutter.y);
    ctx.lineTo(Cutter.headX, Cutter.headY);
    ctx.stroke();
}

function displayScore() {
    ctx.font = Math.floor(0.05 * height) + 'px Ubuntu';
    ctx.fillStyle = "#7E5709";
    ctx.fillText("Score:" + Cutter.score, width * 0.02, height * 0.05);
    ctx.font = Math.floor(0.025 * height) + 'px Ubuntu';
    ctx.fillText("userid: " + userid, width * 0.02, height * 0.085);
}

function startGame() {
    clearAllInterval()
    cutterInit(width * 0.5, height * 0.15, distance(width * 0.5, height * 0.15, width, height) * 0.9, CUTTER_RENDER_SIZE * 0.4);
    golds = generateGold(width * 0.05, height * 0.3, width * 0.90, height * 0.7, GOLD_NUM);
    renderInterval = setInterval(render, 30);
    updateInterval = setInterval(update, 30);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (userid == null) userid = "LLLLLogger";
}

// Get start
Cutter.score = 0;
// Loading ...
progressInterval = setInterval(function() {
    const MARGIN = 3;
    ctx.fillStyle = "#80C617";
    ctx.fillRect(width * 0.31, height * 0.44, width * 0.38, height * 0.12);
    ctx.fillStyle = "#577E09";
    ctx.fillRect(width * 0.32, height * 0.46, width * 0.36, height * 0.08);
    ctx.fillStyle = "#EAFF61";
    // Use Math.max to avoid draw a rect with negative width.
    ctx.fillRect(width * 0.32 + MARGIN, height * 0.46 + MARGIN,
                 Math.max(0, width * 0.36 * (loadProgress / maxLoadProgress) - MARGIN * 2), height * 0.08 - MARGIN * 2);
    ctx.stroke();
    if (loadProgress >= maxLoadProgress) {
        startGame();
    }
}, 30);