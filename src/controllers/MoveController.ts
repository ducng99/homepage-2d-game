import Movable from "../models/extensions/Movable";
import Renderer from "../views/Renderer";

export default class MoveController {
    private entity: Movable

    constructor(ent: Movable) {
        this.entity = ent;
    }

    MoveLeft() {
        if (this.entity.MoveSpeed > 0) this.entity.MoveSpeed = 0;
        this.entity.MoveSpeed -= 1 * Renderer.Instance.TimerDelta;
    }

    MoveRight() {
        if (this.entity.MoveSpeed < 0) this.entity.MoveSpeed = 0;
        this.entity.MoveSpeed += 1 * Renderer.Instance.TimerDelta;
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
            this.entity.MoveSpeed -= this.entity.MoveSpeed / 3 * Renderer.Instance.TimerDelta;
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
                    this.entity.JumpSpeed -= delta * Renderer.Instance.TimerDelta;
                else
                    this.entity.JumpSpeed = Movable.GRAVITY_SPEED;
            }
        }
    }
}