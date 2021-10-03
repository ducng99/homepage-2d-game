import Player from '../models/Player';
import Renderer from '../views/Renderer';
import MoveController from './MoveController'

export default class PlayerMoveController extends MoveController {
    private player: Player;
    
    constructor(player: Player) {
        super(player);
        this.player = player;
    }

    Jump() {
        if (this.player.IsOnGround) {
            this.player.VerticalSpeed = this.player.MaxUpSpeed;
            return true;
        }

        return false;
    }

    StopVertical() {
        if (!this.player.IsOnGround) {
            if (this.player.VerticalSpeed >= 0 && this.player.VerticalSpeed <= 1) {
                this.player.VerticalSpeed -= 2;
            }
            else {
                let delta = Math.abs(this.player.VerticalSpeed) / 5;
                if (this.player.VerticalSpeed - delta >= this.player.MaxDownSpeed)
                    this.player.VerticalSpeed -= delta * Renderer.Instance.TimerDelta;
                else
                    this.player.VerticalSpeed = this.player.MaxDownSpeed;
            }
        }
        else {
            this.player.VerticalSpeed = 0;
        }
    }
}