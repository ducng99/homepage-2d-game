import MoveController from "../../controllers/MoveController";

export enum Direction {
    Left, Right
}

export default abstract class Movable {
    private maxMoveSpeed = 10;
    get MaxMoveSpeed() {
        return this.maxMoveSpeed;
    }
    protected set MaxMoveSpeed(value) {
        this.maxMoveSpeed = value;
    }
    
    private _maxJumpSpeed = 10;
    get MaxJumpSpeed() { return this._maxJumpSpeed}
    set MaxJumpSpeed(value) {
        this._maxJumpSpeed = value;
    }
    
    static GRAVITY_SPEED = -10;

    private _moveController?: MoveController;
    private _moveSpeed = 0;
    private _jumpSpeed = Movable.GRAVITY_SPEED;
    private _direction = Direction.Right;

    protected _isOnGround = false;
    get IsOnGround() { return this._isOnGround }

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
        if (value <= this.MaxMoveSpeed && value >= -this.MaxMoveSpeed) {
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
        if (value >= Movable.GRAVITY_SPEED && value <= this.MaxJumpSpeed) {
            this._jumpSpeed = value;
        }
    }

    get Direction() {
        return this._direction;
    }
}