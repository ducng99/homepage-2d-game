import Entity from './Entity'
import Movable, { Direction } from './extensions/Movable'
import Collidable from './extensions/Collidable'
import { Mixin } from 'ts-mixer'
import Renderer from '../views/Renderer';

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Mixin(Entity, Movable, Collidable) {
    State: PlayerState;

    constructor() {
        super();
        this.State = PlayerState.Standing;
        this.MAX_MOVE_SPEED = 8;
        this.Position.x = 100;
    }

    Update(): void {
        this.Position.MoveX(this.MoveSpeed * Renderer.Instance.TimerDelta);
        if (this.JumpSpeed > 0 || this.Position.y < 700) {
            // Y-axis starts from top down so we will invert it.
            // TODO: Invert in view, not in model
            this.Position.MoveY(-this.JumpSpeed * Renderer.Instance.TimerDelta);
        }
        
        if (this.View) {
            this.View.FlipX.Value = this.Direction === Direction.Left;
        }
        
        if (this.JumpSpeed > Movable.GRAVITY_SPEED) {
            this.State = PlayerState.Jumping;
        }
        else if (this.MoveSpeed === 0) {
            this.State = PlayerState.Standing;
            this.View?.AnimationsManager?.StopAnimation();
        }
        else {
            this.State = PlayerState.Running;
            this.View?.AnimationsManager?.PlayAnimation('player-walk');
        }
    }
}