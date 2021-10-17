import MoveController from "../../controllers/MoveController";
import Entity from "../Entity";

export enum HorizontalDirection {
    Left, Right
}

export default abstract class Movable extends Entity {
    private _maxHorizontalSpeed = 10;
    get MaxHorizontalSpeed() {
        return this._maxHorizontalSpeed;
    }
    protected set MaxHorizontalSpeed(value) {
        this._maxHorizontalSpeed = value;
    }
    
    private _maxUpSpeed = 10;
    get MaxUpSpeed() { return this._maxUpSpeed}
    protected set MaxUpSpeed(value) {
        this._maxUpSpeed = value;
    }
    
    private _maxDownSpeed = -10;
    get MaxDownSpeed() { return this._maxDownSpeed }
    protected set MaxDownSpeed(value) {
        this._maxDownSpeed = value;
    }

    private _moveController?: MoveController;
    private _horizontalSpeed = 0;
    private _verticalSpeed = 0;
    private _direction = HorizontalDirection.Right;

    get MoveController() {
        if (!this._moveController) {
            this._moveController = new MoveController(this);
        }

        return this._moveController;
    }
    
    protected set MoveController(value) {
        this._moveController = value;
    }

    get HorizontalSpeed() {
        return this._horizontalSpeed;
    }

    set HorizontalSpeed(value) {
        if (value > this._maxHorizontalSpeed) {
            this._horizontalSpeed = this._maxHorizontalSpeed;
        }
        else if (value < -this._maxHorizontalSpeed) {
            this._horizontalSpeed = -this.MaxHorizontalSpeed;
        }
        else {
            this._horizontalSpeed = value;
            if (value > 0) {
                this._direction = HorizontalDirection.Right;
            }
            else if (value < 0) {
                this._direction = HorizontalDirection.Left;
            }
        }
    }

    get VerticalSpeed() {
        return this._verticalSpeed;
    }

    set VerticalSpeed(value) {
        if (value > this.MaxUpSpeed) {
            this._verticalSpeed = this.MaxUpSpeed;
        }
        else if (value < this.MaxDownSpeed) {
            this._verticalSpeed = this.MaxDownSpeed;
        }
        else {
            this._verticalSpeed = value;
        }
    }

    get Direction() {
        return this._direction;
    }
    
    protected set Direction(value) {
        this._direction = value;
    }
}