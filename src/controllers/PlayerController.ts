import Player from "../models/Player";

export default class PlayerController {
    private player: Player

    constructor(player: Player) {
        this.player = player;
    }

    public MoveLeft() {
        this.player.Position.MoveX(-1);
    }

    public MoveRight() {
        this.player.Position.MoveX(1);
    }
}