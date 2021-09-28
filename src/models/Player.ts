import PlayerController from '../controllers/PlayerController';
import Entity from './Entity'

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Entity {
    public State: PlayerState;
    public static readonly MAX_MOVE_SPEED = 10;
    
    private _speed = 0;
    get Speed() {
        return this._speed;
    }
    set Speed(value) {
        if (value <= Player.MAX_MOVE_SPEED && value >= -Player.MAX_MOVE_SPEED) {
            this._speed = value;
        }
    }

    private _controller?: PlayerController;
    get Controller() {
        if (!this._controller) {
            this._controller = new PlayerController(this);
        }

        return this._controller;
    }

    constructor() {
        super();
        this.State = PlayerState.Standing;
    }
    
    Update(): void {
        this.Position.MoveX(this.Speed);
    }
}