// Finger
var Finger = {
    x: 0,
    y: 0,
    headX: 0,
    headY: 0,
    t: 0,
    state: 0,
    minRopeLength: 0,
    maxRopeLength: 0,
    held: -1,
    score: 0
};

const DEGREE = Math.PI / 180;
const FINGER_VELOCITY = 0.012;          // Ratio
const FINGER_VELOCITY_SPEEDUP = 0.021;  // Pulling gold ratio
const FINGER_ANGULAR_VELOCITY = 1.75;
const FINGER_STATUS = {
    IDLING: 1,
    STRECTCHING: 2,
    PULLING: 3
};

/**
 * Return a vec2 representing the direction of finger, which satisfying length = 1.0
 * @returns {{Number, Number}}
 */
function fingerDirection() {
    let _angular = Math.sin(FINGER_ANGULAR_VELOCITY*DEGREE*Finger.t) * Math.PI * 0.5;
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

function fingerRopeLength() {
    return distance(Finger.x, Finger.y, Finger.headX, Finger.headY);
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} maxRopeLength - A strectching finger will return with 
 * pulling something (if holds) when it reaches the max rope length.
 */
function fingerInit(x, y, maxRopeLength) {
    Finger.x = x, Finger.y = y;
    Finger.minRopeLength = maxRopeLength * 0.05;
    Finger.maxRopeLength = maxRopeLength;
    Finger.state = FINGER_STATUS.IDLING;
    // Initialize finger direction
    Finger.t = 0;
    let direction = fingerDirection();
    Finger.headX = Finger.x + direction.x * Finger.minRopeLength;
    Finger.headY = Finger.y + direction.y * Finger.minRopeLength;
}

/**
 * Call to launch finger (when press down).
 */
function fingerStrectch() {
    if (Finger.state == FINGER_STATUS.IDLING) {
        Finger.state = FINGER_STATUS.STRECTCHING;
    }
}

/**
 * Update finger.
 * 
 * This function should be called at each update frame/tick.
 */
function fingerUpdate() {
    // Update with status

    let direction = fingerDirection();

    switch (Finger.state) {

        case FINGER_STATUS.IDLING:
            ++Finger.t;
            direction = fingerDirection();
            Finger.headX = Finger.x + direction.x * Finger.minRopeLength;
            Finger.headY = Finger.y + direction.y * Finger.minRopeLength;
            break;

        case FINGER_STATUS.STRECTCHING:
            if (fingerRopeLength() < Finger.maxRopeLength) {
                // Move finger
                Finger.headX += direction.x * FINGER_VELOCITY * Finger.maxRopeLength;
                Finger.headY += direction.y * FINGER_VELOCITY * Finger.maxRopeLength;
                // Check fish
                for(let i = 0; i < fishes.length; ++i) {
                    if(fishes[i].holdsFish.hitbox.isInside(Finger.headX, Finger.headY)) {
                        // Get you!
                        Finger.held = i;
                        Finger.state = FINGER_STATUS.PULLING;
                        fishes[i].capture();
                        fishes[i].holdsFish.move(Finger.headX - fishes[i].holdsFish.x, 
                                                 Finger.headY + fishes[i].holdsFish.height * 0.35 - fishes[i].holdsFish.y);
                        break;
                    }
                }
            } else {
                // Go back and hold nothing
                Finger.headX = Finger.x + direction.x * Finger.maxRopeLength;
                Finger.headY = Finger.y + direction.y * Finger.maxRopeLength;
                Finger.state = FINGER_STATUS.PULLING;
            }
            break;

        case FINGER_STATUS.PULLING:
            if (fingerRopeLength() > Finger.minRopeLength) {
                // Move finger
                Finger.headX -= direction.x * FINGER_VELOCITY_SPEEDUP * Finger.maxRopeLength;
                Finger.headY -= direction.y * FINGER_VELOCITY_SPEEDUP * Finger.maxRopeLength;
                // If finger holds a gold, move gold
                if(Finger.held > -1) {
                    fishes[Finger.held].holdsFish.move(-direction.x * FINGER_VELOCITY_SPEEDUP * Finger.maxRopeLength, 
                                                       -direction.y * FINGER_VELOCITY_SPEEDUP * Finger.maxRopeLength);
                }
            } else {
                // Recover
                Finger.headX = Finger.x + direction.x * Finger.minRopeLength;
                Finger.headY = Finger.y + direction.y * Finger.minRopeLength;
                Finger.state = FINGER_STATUS.IDLING;
                // If finger holds a gold, release it and exchange for score
                if(Finger.held > -1) {
                    Finger.score += fishes[Finger.held].holdsFish.value;
                    fishes.splice(Finger.held, 1);
                    Finger.held = -1;
                }
            }
            break;

        default:
            // ERROR!
    }
}