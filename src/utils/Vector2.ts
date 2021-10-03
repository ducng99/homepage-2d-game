export default class Vector2 {
    x = 0
    y = 0;

    constructor(x?: number, y?: number) {
        if (x) this.x = x;
        if (y) this.y = y;
    }
    
    static from(vec: Vector2) {
        return new Vector2(vec.x, vec.y);
    }

    Move(offsetX: number, offsetY?: number) {
        this.MoveX(offsetX);
        if (offsetY) this.MoveY(offsetY);
        return this;
    }

    MoveX(offsetX: number) {
        this.x += offsetX;
        return this;
    }

    MoveY(offsetY: number) {
        this.y += offsetY;
        return this;
    }
    
    Multiply(times: number) {
        this.x *= times;
        this.y *= times;
        return this;
    }
}