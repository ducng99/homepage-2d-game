import Entity from './Entity'
import Movable from './Movable'
import { FrameTimeRatio } from '../utils/SpeedUtils'
import { Mixin } from 'ts-mixer'

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Mixin(Entity, Movable) {
    State: PlayerState;

    constructor() {
        super();
        this.State = PlayerState.Standing;
        this.MAX_MOVE_SPEED = 8;
    }

    Update(): void {
        this.Position.MoveX(this.MoveSpeed * FrameTimeRatio());
        if (this.JumpSpeed > 0 || this.Position.y < 700) {
            // Y-axis starts from top down so we will invert it.
            // TODO: Invert in view, not in model
            this.Position.MoveY(-this.JumpSpeed * FrameTimeRatio());
        }

        if (this.JumpSpeed > Movable.GRAVITY_SPEED) {
            this.State = PlayerState.Jumping;
        }
        else if (this.MoveSpeed === 0) {
            this.State = PlayerState.Standing;
        }
        else {
            this.State = PlayerState.Running;
        }
    }
}