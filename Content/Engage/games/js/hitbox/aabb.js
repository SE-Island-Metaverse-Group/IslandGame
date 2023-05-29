// AABB Hitbox

class AABBHitbox {

    /**
     * Create a new AABB hitbox by left-top coordinate, width and height.
     * @param {Number} x - Left-top point x coordinate
     * @param {Number} y - Left-top point y coordinate
     * @param {Number} w - width
     * @param {Number} h - height
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
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
     * Return true if point (x, y) is inside the hitbox, otherwise return false;
     * @param {Number} x 
     * @param {Number} y 
     * @returns {boolean}
     */
    isInside(x, y) {
        if ((x >= this.x && x <= this.x + this.w) && (y >= this.y && y <= this.y + this.h)) {
            return true;
        }
        return false;
    }

    /**
     * Return true when it overlaps another `AABBHitbox` box, otherwise return false.
     * @param {AABBHitbox} box - Another `AABBHitbox`.
     */
    isCollided(box) {
        if (Math.max(this.x, box.x) <= Math.min(this.x + this.w, box.x + box.w)
                &&
            Math.max(this.y, box.y) <= Math.min(this.y + this.h, box.y + box.h)) {
            return true;
        }
        return false;
    }
}