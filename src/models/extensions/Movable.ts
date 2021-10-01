import MoveController from "../../controllers/MoveController";

export enum Direction {
    Left, Right
}

export default class Movable {
    protected MAX_MOVE_SPEED = 10;
    MAX_JUMP_SPEED = 50;
    static readonly GRAVITY_SPEED = -20;   // Just for fun, but it works so...

    private _moveController?: MoveController;
    private _moveSpeed = 0;
    private _jumpSpeed = Movable.GRAVITY_SPEED;
    private _direction = Direction.Right;
    
    get MoveController() {
        if (!this._moveController) {
            this._moveController = new MoveController(this);
        }

        return this._moveController;
    }
    
    get MoveSpeed() {
        return this._moveSpeed;
    }
    
    set MoveSpeed(value) {
        if (value <= this.MAX_MOVE_SPEED && value >= -this.MAX_MOVE_SPEED) {
            this._moveSpeed = value;
            if (value > 0) {
                this._direction = Direction.Right;
            }
            else if (value < 0) {
                this._direction = Direction.Left;
            }
        }
    }
    
    get JumpSpeed() {
        return this._jumpSpeed;
    }
    
    set JumpSpeed(value) {
        if (value >= Movable.GRAVITY_SPEED && value <= this.MAX_JUMP_SPEED) {
            this._jumpSpeed = value;
        }
    }
    
    get Direction() {
        return this._direction;
    }
}