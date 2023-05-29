// Cutter
var Cutter = {
    x: 0,
    y: 0,
    headX: 0,
    headY: 0,
    t: 0,
    state: 0,
    minRopeLength: 0,
    maxRopeLength: 0,
    held: -1,
    score: 0,
    hitbox: null
};

const DEGREE = Math.PI / 180;
const CUTTER_VELOCITY = 0.011;          // Ratio
const CUTTER_VELOCITY_SPEEDUP = 0.02;   // Pulling gold ratio
const CUTTER_ANGULAR_VELOCITY = 1.75;
const CUTTER_BLADE_ANGULAR_VELOCITY = 17;   // Zininininin------
const CUTTER_STATUS = {
    IDLING: 1,
    STRECTCHING: 2,
    PULLING: 3
};

/**
 * Return a vec2 representing the direction of cutter, which satisfying length = 1.0
 * @returns {{Number, Number}}
 */
function cutterDirection() {
    let _angular = Math.sin(CUTTER_ANGULAR_VELOCITY*DEGREE*Cutter.t) * Math.PI * 0.5;
    return {
        x: Math.sin(_angular),
        y: Math.cos(_angular)
    };
}

/**
 * Compute distance between two points
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @returns {Number}
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function cutterRopeLength() {
    return distance(Cutter.x, Cutter.y, Cutter.headX, Cutter.headY);
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} maxRopeLength - A strectching cutter will return with pulling something (if holds) when it reaches the max rope length.
 */
function cutterInit(x, y, maxRopeLength, bladeRadius) {
    Cutter.x = x, Cutter.y = y;
    Cutter.minRopeLength = maxRopeLength * 0.05;
    Cutter.maxRopeLength = maxRopeLength;
    Cutter.state = CUTTER_STATUS.IDLING;
    // Initialize cutter direction
    Cutter.t = 0;
    let direction = cutterDirection();
    Cutter.headX = Cutter.x + direction.x * Cutter.minRopeLength;
    Cutter.headY = Cutter.y + direction.y * Cutter.minRopeLength;
    // Add hitbox
    Cutter.hitbox = new RoundHitbox(Cutter.headX, Cutter.headY, bladeRadius);
}

/**
 * Move cutter blade with vector (dx, dy).
 * @param {Number} dx 
 * @param {Number} dy 
 */
function cutterMove(dx, dy) {
    Cutter.headX += dx;
    Cutter.headY += dy;
    Cutter.hitbox.move(dx, dy);
}

/**
 * Call to launch cutter (when press down).
 */
function cutterStrectch() {
    if (Cutter.state == CUTTER_STATUS.IDLING) {
        Cutter.state = CUTTER_STATUS.STRECTCHING;
    }
}

/**
 * Update cutter.
 * 
 * This function should be called at each update frame/tick.
 */
function cutterUpdate() {
    // Update with status

    let direction = cutterDirection();

    switch (Cutter.state) {

        case CUTTER_STATUS.IDLING:
            ++Cutter.t;
            direction = cutterDirection();
            Cutter.headX = Cutter.x + direction.x * Cutter.minRopeLength;
            Cutter.headY = Cutter.y + direction.y * Cutter.minRopeLength;
            break;

        case CUTTER_STATUS.STRECTCHING:
            if (cutterRopeLength() < Cutter.maxRopeLength) {
                // Move cutter
                Cutter.headX += direction.x * CUTTER_VELOCITY * Cutter.maxRopeLength;
                Cutter.headY += direction.y * CUTTER_VELOCITY * Cutter.maxRopeLength;
                // Check gold hitbox
                for(let i = 0; i < golds.length; ++i) {
                    if(golds[i].hitbox.isInside(Cutter.headX, Cutter.headY)) {
                        // Get you!
                        Cutter.held = i;
                        Cutter.state = CUTTER_STATUS.PULLING;
                        break;
                    }
                }
            } else {
                // Go back and hold nothing
                Cutter.headX = Cutter.x + direction.x * Cutter.maxRopeLength;
                Cutter.headY = Cutter.y + direction.y * Cutter.maxRopeLength;
                Cutter.state = CUTTER_STATUS.PULLING;
            }
            break;

        case CUTTER_STATUS.PULLING:
            if (cutterRopeLength() > Cutter.minRopeLength) {
                // Move cutter
                Cutter.headX -= direction.x * CUTTER_VELOCITY_SPEEDUP * Cutter.maxRopeLength;
                Cutter.headY -= direction.y * CUTTER_VELOCITY_SPEEDUP * Cutter.maxRopeLength;
                // If cutter holds a gold, move gold
                if(Cutter.held > -1) {
                    golds[Cutter.held].move(-direction.x * CUTTER_VELOCITY_SPEEDUP * Cutter.maxRopeLength, 
                                            -direction.y * CUTTER_VELOCITY_SPEEDUP * Cutter.maxRopeLength);
                }
            } else {
                // Recover
                Cutter.headX = Cutter.x + direction.x * Cutter.minRopeLength;
                Cutter.headY = Cutter.y + direction.y * Cutter.minRopeLength;
                Cutter.state = CUTTER_STATUS.IDLING;
                // If cutter holds a gold, release it and exchange for score
                if(Cutter.held > -1) {
                    Cutter.score += golds[Cutter.held].value;
                    golds.splice(Cutter.held, 1);
                    Cutter.held = -1;
                }
            }
            break;

        default:
            // ERROR!
    }
}