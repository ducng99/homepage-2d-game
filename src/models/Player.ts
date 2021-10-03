import Entity from './Entity'
import Movable, { Direction } from './extensions/Movable'
import Collidable from './extensions/Collidable'
import { Mixin } from 'ts-mixer'
import Renderer from '../views/Renderer'
import * as PIXI from 'pixi.js'
import GameBrain from './GameBrain'

export enum PlayerState {
    Standing, Running, Jumping
}

enum BoxDirection {
    Top, Bottom, Left, Right
}

export default class Player extends Mixin(Entity, Movable, Collidable) {
    State: PlayerState;

    constructor() {
        super();
        this.State = PlayerState.Standing;
        this.MaxMoveSpeed = 4;
        this.MaxJumpSpeed = 15;
        this.Position.x = 100;
    }

    get Bounds() {
        const width = this.View?.Size.width ?? 0;
        // Player view's X is anchored to center
        return new PIXI.Rectangle(this.Position.x - width / 2, this.Position.y, width, this.View?.Size.height ?? 0);
    }

    Update() {
        // Update player view to flip to the right direction
        if (this.View) {
            this.View.FlipX.Value = this.Direction === Direction.Left;
        }

        // Check collision and move the player
        this.UpdatePosition();

        // Update player state
        this.UpdateState();
        
        // Update animations
        this.UpdateAnimation();
    }
    
    private UpdatePosition() {
        let tmpInfo = {
            nextDistance: 0,
            optimal: 0
        };

        tmpInfo.nextDistance = this.MoveSpeed * Renderer.Instance.TimerDelta;
        if ((this.MoveSpeed < 0 && this.IsCollidingTerrain(BoxDirection.Left, tmpInfo)) || (this.MoveSpeed > 0 && this.IsCollidingTerrain(BoxDirection.Right, tmpInfo))) {
            this.Position.x = tmpInfo.optimal;
        }
        else {
            this.Position.MoveX(this.MoveSpeed * Renderer.Instance.TimerDelta);
        }

        tmpInfo.nextDistance = -this.JumpSpeed * Renderer.Instance.TimerDelta;
        if ((this.JumpSpeed < 0 && this.IsCollidingTerrain(BoxDirection.Bottom, tmpInfo)) || (this.JumpSpeed > 0 && this.IsCollidingTerrain(BoxDirection.Top, tmpInfo))) {
            if (this.JumpSpeed < 0) {
                this._isOnGround = true;
            }
            else {
                this.JumpSpeed = 0;
                this._isOnGround = false;
            }
            this.Position.y = tmpInfo.optimal;
        }
        else {
            this.Position.MoveY(-this.JumpSpeed * Renderer.Instance.TimerDelta);
            this._isOnGround = false;
        }
    }

    private UpdateState() {
        if (!this.IsOnGround) {
            this.State = PlayerState.Jumping;
        }
        else if (this.MoveSpeed === 0) {
            this.State = PlayerState.Standing;
        }
        else {
            this.State = PlayerState.Running;
            
        }
    }

    private UpdateAnimation() {
        if (this.View && this.View.AnimationsManager) {
            switch (this.State) {
                case PlayerState.Standing:
                    this.View.AnimationsManager.StopAnimation();
                    break;
                case PlayerState.Running:
                    this.View.AnimationsManager.PlayAnimation('player-walk');
                    break;
                case PlayerState.Jumping:
                    this.View.AnimationsManager.PlayAnimation('player-jump');
                    break;
            }
        }
    }

    /**
     * Checking collision with map's terrain without looping all blocks.
     * From the bounds box of the player, calculate which blocks the player is sitting in (get specific rows and cols). Then loop through those blocks to check if it is valid (collidable)
     * @param direction which face the function will check (top, bottom, left, right)
     * @param info an object to receive the face optimal value before collision occurs
     * @returns true if player collides with terrain, false otherwise
     */
    IsCollidingTerrain(direction: BoxDirection, info: { nextDistance: number, optimal: number }) {
        const entityBounds = this.Bounds;
        const GameMap = GameBrain.Instance.MapManager.GameMap;
        const TerrainBlocks = GameBrain.Instance.MapManager.TerrainBlocks;

        if (GameMap && GameMap.MapInfo) {
            const tileHeight = GameMap.MapInfo.tileheight;
            const tileWidth = GameMap.MapInfo.tilewidth;

            let topRow, bottomRow, leftCol, rightCol;

            switch (direction) {
                case BoxDirection.Top:
                    let topRowMin = Math.floor(entityBounds.top / tileHeight);
                    let topRowMax = Math.floor((entityBounds.top - info.nextDistance % tileHeight) / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    for (let i = topRowMax; i >= topRowMin; i--) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid) {
                                info.optimal = row[n].Bounds.bottom;
                                return true;
                            }
                        }
                    }
                    break;
                case BoxDirection.Bottom:
                    let bottomRowMin = Math.floor(entityBounds.bottom / tileHeight);
                    let bottomRowMax = Math.floor((entityBounds.bottom + info.nextDistance % tileHeight) / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    for (let i = bottomRowMin; i <= bottomRowMax; i++) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid) {
                                info.optimal = row[n].Bounds.top - entityBounds.height;
                                return true;
                            }
                        }
                    }
                    break;
                case BoxDirection.Left:
                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let leftColMin = Math.floor(entityBounds.left / tileWidth);
                    let leftColMax = Math.floor((entityBounds.left + info.nextDistance % tileWidth) / tileWidth);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftColMax, GameMap.MapInfo.width * i + leftColMin + 1);
                        for (let n = blocks.length - 1; n >= 0; n--) {
                            const block = blocks[n];
                            if (block && block.IsValid) {
                                info.optimal = block.Bounds.right + entityBounds.width / 2;
                                return true;
                            }
                        }
                    }
                    break;
                case BoxDirection.Right:
                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let rightColMin = Math.floor(entityBounds.right / tileWidth);
                    let rightColMax = Math.floor((entityBounds.right + info.nextDistance % tileWidth) / tileWidth);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + rightColMin, GameMap.MapInfo.width * i + rightColMax + 1);
                        for (let n = 0; n < blocks.length; n++) {
                            const block = blocks[n];
                            if (block && block.IsValid) {
                                info.optimal = block.Bounds.left - entityBounds.width / 2;
                                return true;
                            }
                        }
                    }
                    break;
            }
        }

        return false;
    }
}