import PlayerController from '../controllers/PlayerController';
import Entity from './Entity'
import Movable from './Movable'
import { Mixin } from 'ts-mixer'

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Mixin(Entity, Movable) {
    State: PlayerState;

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