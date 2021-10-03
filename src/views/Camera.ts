import Entity from "../models/Entity";
import Renderer from "./Renderer";
import GameBrain from "../models/GameBrain";
import { Direction } from "../models/extensions/Movable";

export default class Camera extends Entity {
    private static _instance: Camera;
    static get Instance() {
        if (!this._instance) {
            this._instance = new Camera;
        }
        return this._instance;
    }

    Scale = 3;
    PlayerOffset = 0.45;
    DirectionChangeOffset = 0.3;
    private Direction = GameBrain.Instance.Player.Direction;

    constructor() {
        super();
    }

    Update() {
        const container = Renderer.Instance.MainContainer;
        const player = GameBrain.Instance.Player;
        const playerPositionX = player.Position.x * this.Scale;
        const screenWidth = Renderer.Instance.App.screen.width;

        const offsetPosition = screenWidth * this.PlayerOffset;
        const offsetRightPosition = screenWidth - offsetPosition;

        const offsetDirChangePosition = screenWidth * this.DirectionChangeOffset;
        const offsetDirChangeRightPosition = screenWidth - offsetDirChangePosition;

        // Update camera position
        if (this.Direction === Direction.Right) {
            if (player.Direction === Direction.Left && playerPositionX < -this.Position.x + offsetDirChangePosition) {
                this.Direction = Direction.Left;
            }
            else if (playerPositionX > -this.Position.x + offsetPosition) {
                const delta = (playerPositionX - offsetPosition + this.Position.x) / 10 * Renderer.Instance.TimerDelta;
                this.Position.x -= delta;
            }
        }
        else {
            if (player.Direction === Direction.Right && playerPositionX > -this.Position.x + offsetDirChangeRightPosition) {
                this.Direction = Direction.Right;
            }
            else if (playerPositionX < -this.Position.x + offsetRightPosition) {
                const delta = (playerPositionX - offsetRightPosition + this.Position.x) / 10 * Renderer.Instance.TimerDelta;
                this.Position.x -= delta;
            }
        }

        // Clamp it down
        const minX = -(GameBrain.Instance.MapManager.Width * this.Scale) + screenWidth;
        if (this.Position.x > 0) {
            this.Position.x = 0;
        }
        else if (this.Position.x < minX) {
            this.Position.x = minX;
        }
        
        // Match center in the view
        this.Position.y = -(GameBrain.Instance.MapManager.Height * container.scale.y - Renderer.Instance.App.screen.height) / 2;

        // Update main container
        container.scale.set(this.Scale);
        container.position.set(this.Position.x, this.Position.y);
    }
}