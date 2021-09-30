import Movable from "../models/Movable";
import { FrameTimeRatio } from '../utils/SpeedUtils'

export default class MoveController {
    private entity: Movable

    constructor(ent: Movable) {
        this.entity = ent;
    }

    MoveLeft() {
        if (this.entity.MoveSpeed > 0) this.entity.MoveSpeed = 0;
        this.entity.MoveSpeed -= 1 * FrameTimeRatio();
    }

    MoveRight() {
        if (this.entity.MoveSpeed < 0) this.entity.MoveSpeed = 0;
        this.entity.MoveSpeed += 1 * FrameTimeRatio();
    }
    
    Jump() {
        if (this.entity.JumpSpeed === Movable.GRAVITY_SPEED) {
            this.entity.JumpSpeed = this.entity.MAX_JUMP_SPEED;
            return true;
        }
        
        return false;
    }
    
    StopMove() {
        if (this.entity.MoveSpeed <= 0.1 && this.entity.MoveSpeed >= -0.1) {
            this.entity.MoveSpeed = 0;
        }
        else if (this.entity.MoveSpeed > 0.1 || this.entity.MoveSpeed < -0.1) {
            this.entity.MoveSpeed -= this.entity.MoveSpeed / 3;
        }
    }
    
    StopJump() {
        if (this.entity.JumpSpeed > Movable.GRAVITY_SPEED)
        {
            if (this.entity.JumpSpeed >= 0 && this.entity.JumpSpeed <= 1) {
                this.entity.JumpSpeed -= 2;
            }
            else {
                let delta = Math.abs(this.entity.JumpSpeed) / 5;
                if (this.entity.JumpSpeed - delta >= Movable.GRAVITY_SPEED)
                    this.entity.JumpSpeed -= delta;
                else
                    this.entity.JumpSpeed = Movable.GRAVITY_SPEED;
            }
        }
    }
}