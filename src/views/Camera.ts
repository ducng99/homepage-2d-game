import Renderer from "./Renderer";
import GameBrain from "../models/GameBrain";
import Movable, { HorizontalDirection } from "../models/extensions/Movable";
import { Container } from "pixi.js";
import ParallaxBackground from './ParallaxBackground'

export default class Camera extends Movable {
    private static _instance: Camera;
    static get Instance() {
        if (!this._instance) {
            this._instance = new Camera;
        }
        return this._instance;
    }
    
    /**
     * ? should this be in Camera?
     */
    readonly Background = new ParallaxBackground;

    Scale = 2;
    private readonly PlayerOffset = 0.45;
    private readonly DirectionChangeOffset = 0.3;

    // set HorizontalSpeed will change this.Direction, we need to maintain our own.
    private CameraMoveDirection = GameBrain.Instance.Player.Direction;

    private constructor() {
        super();
        this.MaxHorizontalSpeed = 8;
    }

    Update(container: Container) {
        const player = GameBrain.Instance.Player;
        const playerPositionX = player.Position.x * this.Scale;
        const playerMaxHorizontalSpeed = player.MaxHorizontalSpeed * this.Scale;
        const screenWidth = Renderer.Instance.App.screen.width;

        const offsetPosition = screenWidth * this.PlayerOffset;
        const offsetRightPosition = screenWidth - offsetPosition;

        const offsetDirChangePosition = screenWidth * this.DirectionChangeOffset;
        const offsetDirChangeRightPosition = screenWidth - offsetDirChangePosition;

        // Check if camera needs to be moved and tell MoveController to move it
        if (this.CameraMoveDirection === HorizontalDirection.Right) {
            if (player.Direction === HorizontalDirection.Left && playerPositionX < -this.Position.x + offsetDirChangePosition) {
                this.CameraMoveDirection = HorizontalDirection.Left;
            }
            else if (player.Direction === HorizontalDirection.Right && playerPositionX >= -this.Position.x + offsetPosition) {
                const clampPosition = -(playerPositionX - offsetPosition);
                
                // Fix jittering
                if (this.Position.x >= clampPosition - playerMaxHorizontalSpeed && this.Position.x <= clampPosition + playerMaxHorizontalSpeed) {
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
        else if (this.CameraMoveDirection === HorizontalDirection.Left) {
            if (player.Direction === HorizontalDirection.Right && playerPositionX > -this.Position.x + offsetDirChangeRightPosition) {
                this.CameraMoveDirection = HorizontalDirection.Right;
            }
            else if (player.Direction === HorizontalDirection.Left && playerPositionX <= -this.Position.x + offsetRightPosition) {
                const clampPosition = -(playerPositionX - offsetRightPosition);
                
                if (this.Position.x >= clampPosition - playerMaxHorizontalSpeed && this.Position.x <= clampPosition + playerMaxHorizontalSpeed) {
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

        // Match bottom of map
        this.Position.y = -(GameBrain.Instance.MapManager.Height * this.Scale - Renderer.Instance.App.screen.height);

        // Update parallax background
        this.Background.Update(this.Position.x);
        
        // Update main container
        container.scale.set(this.Scale);
        container.position.set(this.Position.x, this.Position.y);
    }
}