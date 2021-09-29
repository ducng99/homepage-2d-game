import Player from "../models/Player";
import { GetFrametime } from "../FPSCounter";

export default class PlayerController {
    private player: Player

    constructor(player: Player) {
        this.player = player;
    }

    MoveLeft() {
        if (this.player.Speed > 0) this.player.Speed = 0;
        this.player.Speed -= 1 * (GetFrametime() / (1000 / 60));
    }

    MoveRight() {
        if (this.player.Speed < 0) this.player.Speed = 0;
        this.player.Speed += 1 * (GetFrametime() / (1000 / 60));
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