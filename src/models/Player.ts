import Entity from './Entity'
import Movable, { Direction } from './extensions/Movable'
import Collidable from './extensions/Collidable'
import { Mixin } from 'ts-mixer'
import Renderer from '../views/Renderer';
import { Rectangle } from 'pixi.js';
import GameBrain from './GameBrain';

export enum PlayerState {
    Standing, Running, Jumping
}

export default class Player extends Mixin(Entity, Movable, Collidable) {
    State: PlayerState;

    constructor() {
        super();
        this.State = PlayerState.Standing;
        this.MAX_MOVE_SPEED = 5;
        this.Position.x = 100;
        this.Position.y = 0;
    }

    get Bounds() {
        return this.View?.Bounds ?? new Rectangle;
    }

    Update(): void {

        if (this.View) {
            this.View.FlipX.Value = this.Direction === Direction.Left;
        }

        let tmpInfo = {
            optimal: 0
        };
        
        if ((this.MoveSpeed < 0 && this.CollideTerrainLeft(tmpInfo)) || (this.MoveSpeed > 0 && this.CollideTerrainRight(tmpInfo))) {
            this.Position.x = tmpInfo.optimal;
        }
        else {
            this.Position.MoveX(this.MoveSpeed * Renderer.Instance.TimerDelta);
        }

        if ((this.JumpSpeed < 0 && this.CollideTerrainBottom(tmpInfo)) || (this.JumpSpeed > 0 && this.CollideTerrainTop(tmpInfo))) {
            this.Position.y = tmpInfo.optimal;
        }
        else {
            this.Position.MoveY(-this.JumpSpeed * Renderer.Instance.TimerDelta);
        }

        if (this.JumpSpeed > Movable.GRAVITY_SPEED) {
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

    CollideTerrainTop(info: { optimal: number }) {
        const entityBounds = this.Bounds;
        const MapManager = GameBrain.Instance.Map.MapManager;
        const TerrainBlocks = GameBrain.Instance.Map.TerrainBlocks;

        if (MapManager && MapManager.MapInfo) {
            const tileHeight = MapManager.MapInfo.tileheight;
            const tileWidth = MapManager.MapInfo.tilewidth;

            const topRow = Math.floor((entityBounds.top - 0.1) / tileHeight);
            const leftCol = Math.floor(entityBounds.left / tileWidth);
            const rightCol = Math.floor(entityBounds.right / tileWidth);

            if (TerrainBlocks.length >= MapManager.MapInfo.width * topRow) {
                const row = TerrainBlocks.slice(MapManager.MapInfo.width * topRow, MapManager.MapInfo.width * topRow + MapManager.MapInfo.width);

                for (let col = leftCol >= 0 ? leftCol : 0; col < row.length && col < rightCol; col++) {
                    if (row[col].IsValid) {
                        info.optimal = row[col].Bounds.bottom + 0.05;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    CollideTerrainBottom(info: { optimal: number }) {
        const entityBounds = this.Bounds;
        const MapManager = GameBrain.Instance.Map.MapManager;
        const TerrainBlocks = GameBrain.Instance.Map.TerrainBlocks;

        if (MapManager && MapManager.MapInfo) {
            const tileHeight = MapManager.MapInfo.tileheight;
            const tileWidth = MapManager.MapInfo.tilewidth;

            const bottomRow = Math.floor((entityBounds.bottom + 0.1) / tileHeight);
            const leftCol = Math.floor(entityBounds.left / tileWidth);
            const rightCol = Math.floor(entityBounds.right / tileWidth);

            if (TerrainBlocks.length >= MapManager.MapInfo.width * bottomRow + MapManager.MapInfo.width) {
                const row = TerrainBlocks.slice(MapManager.MapInfo.width * bottomRow, MapManager.MapInfo.width * bottomRow + MapManager.MapInfo.width);

                for (let col = leftCol >= 0 ? leftCol : 0; col < row.length && col <= rightCol; col++) {
                    if (row[col].IsValid) {
                        info.optimal = row[col].Bounds.top - entityBounds.height - 0.05;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    CollideTerrainLeft(info: { optimal: number }) {
        const entityBounds = this.Bounds;
        const MapManager = GameBrain.Instance.Map.MapManager;
        const TerrainBlocks = GameBrain.Instance.Map.TerrainBlocks;

        if (MapManager && MapManager.MapInfo) {
            const tileHeight = MapManager.MapInfo.tileheight;
            const tileWidth = MapManager.MapInfo.tilewidth;

            const topRow = Math.floor(entityBounds.top / tileHeight);
            const bottomRow = Math.floor(entityBounds.bottom / tileHeight);
            const leftCol = Math.floor((entityBounds.left - 0.1) / tileWidth);

            if (TerrainBlocks.length >= MapManager.MapInfo.width * bottomRow + leftCol) {
                for (let i = topRow; i <= bottomRow; i++) {
                    const block = TerrainBlocks[MapManager.MapInfo.width * i + leftCol];
                    if (block.IsValid) {
                        info.optimal = block.Bounds.right + entityBounds.width / 2 + 0.05;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    CollideTerrainRight(info: { optimal: number }) {
        const entityBounds = this.Bounds;
        const MapManager = GameBrain.Instance.Map.MapManager;
        const TerrainBlocks = GameBrain.Instance.Map.TerrainBlocks;

        if (MapManager && MapManager.MapInfo) {
            const tileHeight = MapManager.MapInfo.tileheight;
            const tileWidth = MapManager.MapInfo.tilewidth;

            const topRow = Math.floor(entityBounds.top / tileHeight);
            const bottomRow = Math.floor(entityBounds.bottom / tileHeight);
            const rightCol = Math.floor((entityBounds.right + 0.1) / tileWidth);

            if (TerrainBlocks.length >= MapManager.MapInfo.width * bottomRow + rightCol) {
                for (let i = topRow; i <= bottomRow; i++) {
                    const block = TerrainBlocks[MapManager.MapInfo.width * i + rightCol];
                    if (block.IsValid) {
                        info.optimal = block.Bounds.left - entityBounds.width / 2 - 0.05;
                        return true;
                    }
                }
            }
        }

        return false;
    }
}