// Round Hitbox

class RoundHitbox {

    /**
     * Create a new round hitbox by center coordinate and circle radius.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} radius 
     */
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.r = radius;
    }

    /**
     * Move hitbox with vector (dx, dy) without collision detection.
     * @param {Number} dx 
     * @param {Number} dy 
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Return Euclidean distance between point (x, y) and hitbox center point.
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Number} Distance.
     */
    distance(x, y) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }

    /**
     * Return true if point (x, y) is inside the hitbox, otherwise return false;
     * @param {Number} x 
     * @param {Number} y 
     * @returns {boolean}
     */
    isInside(x, y) {
        if (this.distance(x, y) < this.r) {
            return true;
        }
        return false;
    }

    /**
     * Return true when it overlaps another `RoundHitbox` box, otherwise return false.
     * @param {RoundHitbox} box - Another `RoundHitbox`.
     */
    isCollided(box) {
        if (this.distance(box.x, box.y) < this.r + box.r) {
            return true;
        }
        return false;
    }
}