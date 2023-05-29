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
var fingerImg = registerImageResource("res/textures/GoldMiner/finger.png", increaseProgress);

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

// Game
const FINGER_RENDER_SIZE = Math.floor(Math.sqrt(0.002 * width * height));

function render() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawGold();
    drawFinger();
    displayScore();
    // If win
    if(golds.length == 0) {
        mineWin(userid, Finger.score);
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
    ctx.fillStyle = "#7E5709";
    ctx.fillText("Score:" + Math.floor(Finger.score), width * 0.02, height * 0.05);
    ctx.font = Math.floor(0.025 * height) + 'px Ubuntu';
    ctx.fillText("userid: " + userid, width * 0.02, height * 0.085);
}

function displayProgress() {
    const MARGIN = 3;
    ctx.fillStyle = "#C68017";
    ctx.fillRect(width * 0.31, height * 0.44, width * 0.38, height * 0.12);
    ctx.fillStyle = "#7E5709";
    ctx.fillRect(width * 0.32, height * 0.46, width * 0.36, height * 0.08);
    ctx.fillStyle = "#FFEA61";
    // Use Math.max to avoid draw a rect with negative width.
    ctx.fillRect(width * 0.32 + MARGIN, height * 0.46 + MARGIN,
                 Math.max(0, width * 0.36 * (loadProgress / maxLoadProgress) - MARGIN * 2), height * 0.08 - MARGIN * 2);
    ctx.stroke();
    if (loadProgress >= maxLoadProgress) {
        MiningXHR.send(null);
    }
}

function startGame() {
    clearAllInterval();
    fingerInit(width * 0.5, height * 0.15, distance(width * 0.5, height * 0.15, width, height) * 0.9);
    golds = generateGold(width * 0.05, height * 0.3, width * 0.90, height * 0.7, GOLD_NUM);
    renderInterval = setInterval(render, 30);
    updateInterval = setInterval(fingerUpdate, 30);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    if (userid == null) userid = "Gold Miner";
}

// Get start
Finger.score = 0;
// Check rod
var MiningXHR = new XMLHttpRequest();
MiningXHR.open("GET", "http://81.68.140.151:7853/api/mining/check?userid=" + userid, true);
MiningXHR.onreadystatechange = function () {

    let fadeTick = 150;
    ctx.font = Math.floor(0.07 * height) + 'px Ubuntu';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#fff5b1";

    if (MiningXHR.readyState === 4) {
        switch (MiningXHR.status) {
            case 200:
                // OK and load image resources
                startGame();
                break;
            case 400:
                // User does not have a rod
                clearAllInterval();
                (function fadingRodAlert() {
                    ctx.clearRect(0, 0, width, height);
                    drawBackground();
                    ctx.fillStyle = "#fff5b1" + Math.min(Math.ceil(fadeTick * 8.5), 255).toString(16);
                    ctx.fillText("Please buy a pickaxe on shop at first!", width * 0.5, height * 0.5);
                    ctx.fillText("Press F to exit.", width * 0.5, height * 0.6);
                    --fadeTick;
                    if (fadeTick <= 0) window.close();
                    else setTimeout(fadingRodAlert, 30);
                })();
                break;
            default:
                // Connection error
                clearAllInterval();
                (function fadingConnectionAlert() {
                    ctx.clearRect(0, 0, width, height);
                    drawBackground();
                    ctx.fillStyle = "#fff5b1" + Math.min(Math.ceil(fadeTick * 8.5), 255).toString(16);
                    ctx.fillText("Error: You has been disconnected from server.", width * 0.5, height * 0.5);
                    ctx.fillText("Press F to exit.", width * 0.5, height * 0.6);
                    --fadeTick;
                    if (fadeTick <= 0) window.close();
                    else setTimeout(fadingConnectionAlert, 30);
                })();
                break;
        }
    }
}
progressInterval = setInterval(displayProgress, 30);