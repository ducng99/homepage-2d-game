export default class Vector2 {
    public x = 0
    public y = 0;

    constructor(x?: number, y?: number) {
        if (x) this.x = x;
        if (y) this.y = y;
    }

    public Move(offsetX: number, offsetY?: number) {
        this.MoveX(offsetX);
        if (offsetY) this.MoveY(offsetY);
    }

    public MoveX(offsetX: number) {
        this.x += offsetX;
    }

    public MoveY(offsetY: number) {
        this.y += offsetY;
    }
}