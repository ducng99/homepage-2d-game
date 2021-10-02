import Entity from './Entity'
import Movable, { Direction } from './extensions/Movable'
import Collidable from './extensions/Collidable'
import { Mixin } from 'ts-mixer'
import Renderer from '../views/Renderer';
import { Rectangle } from 'pixi.js';
import GameBrain from './GameBrain';
import MapBlock from './MapBlock';

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
        this.MAX_MOVE_SPEED = 4;
        this.MAX_JUMP_SPEED = 15;
        this.Position.x = 100;
        this.Position.y = 0;
    }

    get Bounds() {
        const width = this.View?.Size.width ?? 0;
        return new Rectangle(this.Position.x - width / 2, this.Position.y, width, this.View?.Size.height ?? 0);
    }

    Update() {
        if (this.View) {
            this.View.FlipX.Value = this.Direction === Direction.Left;
        }

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

        if (!this.IsOnGround) {
            this.State = PlayerState.Jumping;
        }
        else if (this.MoveSpeed === 0) {
            this.State = PlayerState.Standing;
            this.View?.AnimationsManager?.StopAnimation();
        }
        else {
            this.State = PlayerState.Running;
            this.View?.AnimationsManager?.PlayAnimation('player-walk');
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
        const MapManager = GameBrain.Instance.Map.MapManager;
        const TerrainBlocks = GameBrain.Instance.Map.TerrainBlocks;

        if (MapManager && MapManager.MapInfo) {
            const tileHeight = MapManager.MapInfo.tileheight;
            const tileWidth = MapManager.MapInfo.tilewidth;

            let topRow, bottomRow, leftCol, rightCol;

            switch (direction) {
                case BoxDirection.Top:
                    let topRowMin = Math.floor(entityBounds.top / tileHeight);
                    let topRowMax = Math.floor((entityBounds.top - info.nextDistance % tileHeight) / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    for (let i = topRowMax; i >= topRowMin; i--) {
                        const row = TerrainBlocks.slice(MapManager.MapInfo.width * i + leftCol, MapManager.MapInfo.width * i + rightCol + 1);

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
                        const row = TerrainBlocks.slice(MapManager.MapInfo.width * i + leftCol, MapManager.MapInfo.width * i + rightCol + 1);
                        
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
                        const blocks = TerrainBlocks.slice(MapManager.MapInfo.width * i + leftColMax, MapManager.MapInfo.width * i + leftColMin + 1);
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
                        const blocks = TerrainBlocks.slice(MapManager.MapInfo.width * i + rightColMin, MapManager.MapInfo.width * i + rightColMax + 1);
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