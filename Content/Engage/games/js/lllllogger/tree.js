// Gold

/**
 * Input `x`, `y` and `scale` of a gold, return a new round hitbox object of this gold.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} scale
 * @returns {RoundHitbox} `RoundHitbox` of this gold.
 */
function GoldHitbox(x, y, scale) {
    return new RoundHitbox(x, y, scale * 0.4);
}

const LOG_DROP_TIME = 30;   // Ticks
const LOG_FADEOUT_TIME = 60;

class Log {

    /**
     * Create a log drop animation object with update interface.
     * You should implement render function on upper level by yourself.
     * 
     * It will move through a quasi-parabola from (x, y) to (destX, destY).
     * 
     * And naturally **top to bottom**.
     * (Maybe you wonder if the destination is placed over the start point?)
     * 
     * @param {Number} startX 
     * @param {Number} startY
     * @param {Number} destX
     * @param {Number} destY
     */
    constructor(startX, startY, destX, destY) {
        this.x = startX;
        this.y = startY;
        this.start = {
            x: startX,
            y: startY
        }
        this.dest = {
            x: destX,
            y: destY
        }
        this.tick = 0;
        this.alpha = 1;
    }

    update() {
        if (this.tick <= LOG_DROP_TIME) {
            // Falling!
            this.x = (this.dest.x - this.start.x) * (this.tick / LOG_DROP_TIME) + this.start.x;
            this.y = (this.dest.y - this.start.y) * Math.pow(this.tick / LOG_DROP_TIME, 2) + this.start.y;
            ++this.tick;
        } else if (this.tick <= LOG_FADEOUT_TIME) {
            // Fading out
            this.alpha -= 1.0 / (LOG_FADEOUT_TIME - LOG_DROP_TIME);
        }
    }
}

class Tree {

    constructor(x, y, height, volume) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = height * 0.5;
        this.volume = volume;
        // No hitbox
    }
}

class Gold {

    /**
     * Create a new gold at (x, y) as its center point.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} scale - The render scale of this gold (px)
     * @param {Number} value - Decide how much the player will earn after strectching it
     * @param {Number} rotate - Rotate radian, just influence appearance
     */
    constructor(x, y, scale, value, rotate) {
        this.x = x;
        this.y = y;
        this.scale = scale;     // Render scale
        this.value = value;
        this.rotate = rotate;
        // Hitbox is smaller than gold image
        this.hitbox = GoldHitbox(x, y, scale);
    }

    /**
     * Move gold with vector (dx, dy).
     * (Used for finger)
     * @param {Number} dx 
     * @param {Number} dy 
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.hitbox.move(dx, dy);
    }
}

function F1(x) {
    return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);
}

/**
 * Generate `number` trees on a given planar area.
 * @param {Number} rangeX - Lefttop `x` of area (px, same below)
 * @param {Number} rangeY - Lefttop `y` of area
 * @param {Number} rangeW - Width of area
 * @param {Number} rangeH - Height of area
 * @param {Number} number - The number of trees should be generated. EXCESSIVE INPUT MAY CAUSE WEB PAGE DEAD!
 * @returns {[Tree]} A list containing trees.
 */
function generateForest(rangeX, rangeY, rangeW, rangeH, number) {
    let ret = [];
    let base, height, value;
    let x, y;
    // Scale ratio: depending on game area
    const TREE_HEIGHT_RATIO = Math.sqrt(0.018 * rangeW * rangeH) / 30;

    let k = 0;
    let intervalNum = number + Math.ceil(Math.random * 0.5 * number);
    // Tree bucket
    let tb = [];
    for(let i = 0; i < intervalNum; ++i) tb[i] = 0;
    // Randomly choose intervals
    for(let i = 0; i < intervalNum; ++i) {
        k = Math.floor(Math.random() * intervalNum);
    }
    // Place tree
    for(let i = 0; i < intervalNum; ++i) {
        // Scale & Value
        base = Math.floor(Math.random() * 44.0 + 27.0);
        height = Math.floor(base * TREE_HEIGHT_RATIO);
        value = Math.floor(base * 30.0 + Math.random() * 8.0);
        // Place tree on map
        x = rangeW * (i + Math.random()) / intervalNum + rangeX;
        y = Math.random() * (rangeH - height) + rangeY + 0.5 * height;
        // ret.push(new Tree(...));
    }
    return ret;
}