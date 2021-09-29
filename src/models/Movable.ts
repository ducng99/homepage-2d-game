export enum Direction {
    Left, Right
}

export default class Movable {
    MAX_MOVE_SPEED = 10;
    
    private _speed = 0;
    get Speed() {
        return this._speed;
    }
    set Speed(value) {
        if (value <= this.MAX_MOVE_SPEED && value >= -this.MAX_MOVE_SPEED) {
            this._speed = value;
            if (value > 0) {
                this._direction = Direction.Right;
            }
            else if (value < 0) {
                this._direction = Direction.Left;
            }
        }
    }
    
    private _direction = Direction.Right;
    get Direction() {
        return this._direction;
    }
}