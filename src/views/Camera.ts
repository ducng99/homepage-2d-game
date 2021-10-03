import Entity from "../models/Entity";
import Renderer from "./Renderer";
import GameBrain from "../models/GameBrain";
import Movable, { Direction } from "../models/extensions/Movable";
import { Mixin } from "ts-mixer";

export default class Camera extends Mixin(Entity, Movable) {
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

    // set HorizontalSpeed will change this.Direction, we need to maintain our own.
    private CameraMoveDirection = GameBrain.Instance.Player.Direction

    constructor() {
        super();
        this.MaxHorizontalSpeed = 8;
        this.MoveController.EaseInSpeed = 1;
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
        if (this.CameraMoveDirection === Direction.Right) {
            if (player.Direction === Direction.Left && playerPositionX < -this.Position.x + offsetDirChangePosition) {
                this.CameraMoveDirection = Direction.Left;
            }
            else if (player.Direction === Direction.Right && playerPositionX >= -this.Position.x + offsetPosition) {
                const clampPosition = -(playerPositionX - offsetPosition);
                
                if (this.Position.x >= clampPosition - player.MaxHorizontalSpeed && this.Position.x <= clampPosition + player.MaxHorizontalSpeed) {
                    this.Position.x = clampPosition;
                }
                else {
                    this.MoveController.MoveLeft();
                }
            }
            else {
                this.MoveController.StopHorizontal();
            }
        }
        else if (this.CameraMoveDirection === Direction.Left) {
            if (player.Direction === Direction.Right && playerPositionX > -this.Position.x + offsetDirChangeRightPosition) {
                this.CameraMoveDirection = Direction.Right;
            }
            else if (player.Direction === Direction.Left && playerPositionX <= -this.Position.x + offsetRightPosition) {
                const clampPosition = -(playerPositionX - offsetRightPosition);
                
                if (this.Position.x >= clampPosition - player.MaxHorizontalSpeed && this.Position.x <= clampPosition + player.MaxHorizontalSpeed) {
                    this.Position.x = clampPosition;
                }
                else {
                    this.MoveController.MoveRight();
                }
            }
            else {
                this.MoveController.StopHorizontal();
            }
        }

        // Update position based on speed
        this.Position.MoveX(this.HorizontalSpeed);

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