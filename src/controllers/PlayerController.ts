import Player from "../models/Player";

export default class PlayerController {
    private player: Player

    constructor(player: Player) {
        this.player = player;
    }

    public MoveLeft() {
        if (this.player.Speed > 0) this.player.Speed = 0;
        this.player.Speed -= 1;
    }

    public MoveRight() {
        if (this.player.Speed < 0) this.player.Speed = 0;
        this.player.Speed += 1;
    }
    
    public Stop() {
        if (this.player.Speed > 0) {
            this.player.Speed -= 1;
        }
        else if (this.player.Speed < 0) {
            this.player.Speed += 1;
        }
    }
}