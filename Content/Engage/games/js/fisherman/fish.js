// Fish (Edited from Gold)

const FISH_STATUS = {
    IDLING: 1,
    WANDERING: 2,
    CAPTURED: 3
};

const FISH_FACETO = {
    LEFT: 1,
    RIGHT: 2
}

function F1(x) {
    return 3 * Math.pow(x, 2) - 2 * Math.pow(x, 3);
}

class Fish {

    /**
     * Fish render width-height ratio
     * 
     * All fish appearances should satisfy `width = height * FISH_ASPECT_RATIO`.
     */
    FISH_ASPECT_RATIO = 1.7566765578635015;

    /**
     * Create a new gold at (x, y) as its center point.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} height - The render height of fish (px)
     * @param {Number} value - Decide how much the player will earn after strectching it
     */
    constructor(x, y, height, value) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = height * this.FISH_ASPECT_RATIO;
        this.value = value;
        this.state = FISH_STATUS.IDLING;
        this.face = (Math.random() >= 0.5) ? FISH_FACETO.LEFT : FISH_FACETO.RIGHT;
        // Hitbox
        this.hitbox = new AABBHitbox(this.x - this.width * 0.38, this.y - this.height * 0.38, this.width * 0.76, this.height * 0.76);
    }

    /**
     * Move fish.
     * (Used for finger or fish intelligence)
     * @param {Number} dx 
     * @param {Number} dy 
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.hitbox.move(dx, dy);
    }
}

class FishIntelligence {
    
    /**
     * A fish can speedup until it reaches this restriction.
     */
    fishMaxVelocity = 0.0;

    /**
     * Create a fish intelligence on some fish, this fish just wanders in given rect area.
     * @param {Fish} fish - Fish object
     * @param {Number} ltx - X coordinate of left-top point
     * @param {Number} lty - Y coordinate of left-top point
     * @param {Number} rbx - X coordinate of right-bottom point
     * @param {Number} rby - Y coordinate of left-bottom point
     */
    constructor(fish, ltx, lty, rbx, rby) {
        if (ltx > rbx || lty > rby) throw "Invalid rect area!";
        this.minX = ltx;
        this.minY = lty;
        this.maxX = rbx;
        this.maxY = rby;
        this.holdsFish = fish;
        // Tick flag is used to compute moving process without velocity
        this.tick = Math.ceil(Math.random() * 91 + 15);
        this.moveTick = this.tick;
        // start->dest is the moving path
        this.start = {
            x: fish.x,
            y: fish.y
        }
        this.dest = {
            x: 0,
            y: 0
        }
    }

    /**
     * Compute path distance.
     * @returns {Number} Euclidean distance between start point and destination point.
     */
    distance() {
        return Math.sqrt(Math.pow(this.start.x - this.dest.x, 2) + Math.pow(this.start.y - this.dest.y, 2));
    }

    update() {

        // Tick decreasing ...
        --this.tick;

        let dx = 0, dy = 0;

        switch (this.holdsFish.state) {

            case FISH_STATUS.IDLING:
                if (this.tick <= 0) {
                    // Start moving
                    this.start = {
                        x: this.holdsFish.x,
                        y: this.holdsFish.y
                    }
                    this.dest = {
                        x: Math.random() * (this.maxX - this.minX) + this.minX,
                        y: Math.random() * (this.maxY - this.minY) + this.minY
                    }
                    this.moveTick = Math.ceil(this.distance() / FishIntelligence.fishMaxVelocity);
                    this.tick = this.moveTick;
                    this.holdsFish.state = FISH_STATUS.WANDERING;
                    this.holdsFish.face = (this.dest.x - this.start.x >= 0) ? FISH_FACETO.RIGHT : FISH_FACETO.LEFT;
                }
                break;

            case FISH_STATUS.WANDERING:
                if (this.tick <= 0) {
                    // Stop moving
                    this.holdsFish.state = FISH_STATUS.IDLING;
                    dx = this.dest.x - this.holdsFish.x;
                    dy = this.dest.y - this.holdsFish.y;
                    this.holdsFish.move(dx, dy);
                    this.tick = Math.ceil(Math.pow(Math.random() * 13, 2) + 30);    // [30, 199)
                } else {
                    // Keep moving
                    dx = F1(1 - this.tick / this.moveTick) * (this.dest.x - this.start.x) + this.start.x - this.holdsFish.x;
                    dy = F1(1 - this.tick / this.moveTick) * (this.dest.y - this.start.y) + this.start.y - this.holdsFish.y;
                    this.holdsFish.move(dx, dy);
                }
                break;

            case FISH_STATUS.CAPTURED:
                // I surrender, you choose favorite posture by yourself.
                break;

            default:
                throw "How can you assign an invalid state to a poor little fish?";
        }
    }

    capture() {
        if (this.holdsFish.state != FISH_STATUS.CAPTURED)
            this.holdsFish.state = FISH_STATUS.CAPTURED;
    }
}

/**
 * Generate `number` fishes on a given planar area.
 * @param {Number} rangeX - Lefttop `x` of area (px, same below)
 * @param {Number} rangeY - Lefttop `y` of area
 * @param {Number} rangeW - Width of area
 * @param {Number} rangeH - Height of area
 * @param {Number} number - The number of fishes should be generated. EXCESSIVE INPUT MAY CAUSE WEB PAGE DEAD!
 * @returns {[FishIntelligence]} A list containing fish intelligences.
 */
function generateFish(rangeX, rangeY, rangeW, rangeH, number) {
    let ret = [];
    let base, height, value;
    let _fish;
    // Scale ratio: depending on game area
    const FISH_HEIGHT_RATIO = Math.sqrt(0.016 * rangeW * rangeH) / 30;

    // Set max velocity
    FishIntelligence.fishMaxVelocity = Math.sqrt(rangeW * rangeH) / 133;

    for(let i = 0; i < number; ++i) {
        // Scale & Value
        base = Math.floor(Math.random() * 29.0 + 28.0);
        height = Math.floor(base * FISH_HEIGHT_RATIO);
        value = Math.floor(base * 16.0 + Math.random() * 9.0);
        // Place fish on map
        _fish = new Fish(Math.random() * rangeW + rangeX, Math.random() * rangeH + rangeY, height, value);
        ret.push(new FishIntelligence(_fish, rangeX, rangeY, rangeX + rangeW, rangeY + rangeH));
    }
    return ret;
}