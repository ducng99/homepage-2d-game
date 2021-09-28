import PlayerController from '../controllers/PlayerController';
import Entity from './Entity'

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Entity {
    public State: PlayerState;

    private _controller?: PlayerController;
    public get Controller() {
        if (!this._controller) {
            this._controller = new PlayerController(this);
        }

        return this._controller;
    }

    constructor() {
        super();
        this.State = PlayerState.Standing;
    }
}