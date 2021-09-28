import GameBrain from "./models/GameBrain";

export default class InputHandler {
    private static _instance?: InputHandler
    public static get Instance() {
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
        
        for (let i = 0; i < this.KeysDown.length; i++) {
            switch (this.KeysDown[i]) {
                case "ArrowLeft":
                    GameBrain.Instance.Player.Controller.MoveLeft();
                    playerMoved = true;
                    break;
                case "ArrowRight":
                    GameBrain.Instance.Player.Controller.MoveRight();
                    playerMoved = true;
                    break;
                default:
                    break;
            }
        }
        
        if (!playerMoved) GameBrain.Instance.Player.Controller.Stop();
    }
}