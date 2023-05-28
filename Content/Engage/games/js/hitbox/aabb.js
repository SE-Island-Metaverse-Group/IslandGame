// AABB Hitbox

class AABBHitbox {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Move hitbox
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Return true if input point is inside it, otherwise return false;
    isInside(x, y) {
        if ((x >= this.x && x <= this.x + this.w) && (y >= this.y && y <= this.y + this.h)) {
            return true;
        }
        return false;
    }

    // Return true when it overlaps another AABB Hitbox, otherwise return false.
    isCollided(box) {
        if (Math.max(this.x, box.x) <= Math.min(this.x + this.w, box.x + box.w)
                &&
            Math.max(this.y, box.y) <= Math.min(this.y + this.h, box.y + box.h)) {
            return true;
        }
        return false;
    }
}