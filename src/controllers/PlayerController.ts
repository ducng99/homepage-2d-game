import Player from "../models/Player";
import { FrameTimeRatio } from '../utils/SpeedUtils'

export default class PlayerController {
    private player: Player

    constructor(player: Player) {
        this.player = player;
    }

    MoveLeft() {
        if (this.player.Speed > 0) this.player.Speed = 0;
        this.player.Speed -= 1 * FrameTimeRatio();
    }

    MoveRight() {
        if (this.player.Speed < 0) this.player.Speed = 0;
        this.player.Speed += 1 * FrameTimeRatio();
    }
    
    Stop() {
        if (this.player.Speed <= 0.1 && this.player.Speed >= -0.1) {
            this.player.Speed = 0;
        }
        else if (this.player.Speed > 0.1 || this.player.Speed < -0.1) {
            this.player.Speed -= this.player.Speed / 3;
        }
    }
}