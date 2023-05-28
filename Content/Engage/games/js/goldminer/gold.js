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

function F2(x) {
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
}

/**
 * Generate `number` golds on a given planar area.
 * @param {Number} rangeX - Lefttop `x` of area (px, same below)
 * @param {Number} rangeY - Lefttop `y` of area
 * @param {Number} rangeW - Width of area
 * @param {Number} rangeH - Height of area
 * @param {Number} number - The number of golds should be generated. EXCESSIVE INPUT MAY CAUSE WEB PAGE DEAD!
 * @returns {[Gold]} A list containing golds.
 */
function generateGold(rangeX, rangeY, rangeW, rangeH, number) {
    let ret = [];
    let base, scale, value;
    let x, y, invalid_pos;
    let hbox;
    // Scale ratio: depending on game area
    const GOLD_SCALE_RATIO = Math.sqrt(0.018 * rangeW * rangeH) / 30;
    // Value ratio
    const GOLD_VALUE_RATIO = 8.0;
    const GOLD_VALUE_BASE = 30.0;

    for(let i = 0; i < number; ++i) {
        // Scale & Value
        base = Math.floor(Math.random() * 44.0 + 27.0);
        scale = Math.floor(base * GOLD_SCALE_RATIO);
        value = Math.floor(base * GOLD_VALUE_RATIO + Math.random() * GOLD_VALUE_BASE);
        // Place gold on map
        do {
            invalid_pos = false;
            x = F1(Math.random()) * (rangeW - scale) + rangeX;
            y = Math.random() * (rangeH - scale) + rangeY;
            hbox = GoldHitbox(x, y, scale);     // Hitbox of this gold
            // Check overlap region
            for(let j = 0; j < ret.length; ++j) {
                if (hbox.isCollided(ret[j].hitbox)) {
                    invalid_pos = true;
                    break;
                }
            }
        } while(invalid_pos);
        ret.push(new Gold(x, y, scale, value, Math.random() * Math.PI * 2.0));
    }
    return ret;
}