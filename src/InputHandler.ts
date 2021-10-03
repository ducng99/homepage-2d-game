import PlayerMoveController from "./controllers/PlayerMoveController";
import GameBrain from "./models/GameBrain";

export default class InputHandler {
    private static _instance?: InputHandler
    static get Instance() {
        if (!this._instance) {
            this._instance = new InputHandler
        }

        return this._instance
    }

    private KeysDown: string[] = []

    private constructor() { }

    OnKeyDown(key: string) {
        if (!this.KeysDown.includes(key))
            this.KeysDown.push(key);
    }

    OnKeyUp(key: string) {
        let i = this.KeysDown.indexOf(key);
        if (i !== -1)
            this.KeysDown.splice(i, 1);
    }

    Handle() {
        let playerMoved = false;
        let playerJumped = false;
        
        const playerMoveController = GameBrain.Instance.Player.MoveController as PlayerMoveController;
        
        for (let i = 0; i < this.KeysDown.length; i++) {
            switch (this.KeysDown[i]) {
                case "ArrowLeft":
                    playerMoveController.MoveLeft();
                    playerMoved = true;
                    break;
                case "ArrowRight":
                    playerMoveController.MoveRight();
                    playerMoved = true;
                    break;
                case "Space":
                case " ":
                    playerJumped = playerMoveController.Jump();
                    break;
                default:
                    break;
            }
        }
        
        if (!playerMoved) playerMoveController.StopHorizontal();
        if (!playerJumped) playerMoveController.StopVertical();
    }
}