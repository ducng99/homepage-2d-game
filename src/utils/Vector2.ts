export default class Vector2 {
    x = 0
    y = 0;

    constructor(x?: number, y?: number) {
        if (x) this.x = x;
        if (y) this.y = y;
    }

    Move(offsetX: number, offsetY?: number) {
        this.MoveX(offsetX);
        if (offsetY) this.MoveY(offsetY);
    }

    MoveX(offsetX: number) {
        this.x += offsetX;
    }

    MoveY(offsetY: number) {
        this.y += offsetY;
    }
}