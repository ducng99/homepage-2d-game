import Entity from "../models/Entity";
import Collidable from "../models/extensions/Collidable";
import * as PIXI from 'pixi.js'
import GameBrain from "../models/GameBrain";
import BlockTypes from "../models/maps/BlockTypes";
import '../utils/RectangleExtra'
import '../utils/PolygonExtra'

export enum BoxDirection {
    Top, Bottom, Left, Right
}

export default class CollisionController {
    private _entity: Entity & Collidable;

    constructor(entity: Entity & Collidable) {
        this._entity = entity;
    }
    
    /**
     * Checking collision with map's terrain without looping all blocks.
     * From the bounds box of the player, calculate which blocks the player is sitting in (get specific rows and cols). Then loop through those blocks to check if it is valid (collidable)
     * @param direction which face the function will check (top, bottom, left, right)
     * @param info an object to receive the face optimal value before collision occurs
     * @returns true if player collides with terrain, false otherwise
     */
     IsCollidingTerrain(direction: BoxDirection, info: { nextDistance: number, optimal: number }) {
        const entityBounds = this._entity.Bounds;
        const GameMap = GameBrain.Instance.MapManager.GameMap;
        const TerrainBlocks = GameBrain.Instance.MapManager.TerrainBlocks;

        if (GameMap && GameMap.MapInfo) {
            const tileHeight = GameMap.MapInfo.tileheight;
            const tileWidth = GameMap.MapInfo.tilewidth;

            let topRow, bottomRow, leftCol, rightCol, tmpEntityBounds;

            switch (direction) {
                case BoxDirection.Top:
                    // If outside of map, return true to prevent moving
                    if (entityBounds.top + info.nextDistance <= 0) {
                        info.optimal = this._entity.Position.y;
                        return true;
                    }

                    let topRowMin = Math.floor((entityBounds.top + info.nextDistance % tileHeight) / tileHeight);
                    let topRowMax = Math.floor(entityBounds.top / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    // Use this to check intersects
                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x + 0.1, entityBounds.y, entityBounds.width - 0.2, entityBounds.height);

                    for (let i = topRowMax; i >= topRowMin; i--) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid && row[n].BlockTypes & BlockTypes.BottomBlocked && row[n].Bounds.intersects(tmpEntityBounds)) {
                                info.optimal = row[n].Bounds.bottom;
                                return true;
                            }
                        }
                    }

                    // Check collision with other polygons
                    for (const poly of GameMap.PolyBlocks) {
                        if (poly.BlockTypes & BlockTypes.BottomBlocked && poly.Polygon.intersectsRect(tmpEntityBounds)) {
                            return true;
                        }
                    }
                    break;
                case BoxDirection.Bottom:
                    if (entityBounds.bottom + info.nextDistance >= GameMap.Height) {
                        info.optimal = this._entity.Position.y;
                        return true;
                    }

                    let bottomRowMin = Math.floor(entityBounds.bottom / tileHeight);
                    let bottomRowMax = Math.floor((entityBounds.bottom + info.nextDistance % tileHeight) / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x + 0.1, entityBounds.y, entityBounds.width - 0.2, entityBounds.height);

                    for (let i = bottomRowMin; i <= bottomRowMax; i++) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid && row[n].BlockTypes & BlockTypes.TopBlocked && row[n].Bounds.intersects(tmpEntityBounds)) {
                                info.optimal = row[n].Bounds.top - entityBounds.height;
                                return true;
                            }
                        }
                    }

                    // Check collision with other polygons
                    for (const poly of GameMap.PolyBlocks) {
                        if (poly.BlockTypes & BlockTypes.TopBlocked && poly.Polygon.intersectsRect(tmpEntityBounds)) {
                            return true;
                        }
                    }
                    break;
                case BoxDirection.Left:
                    if (entityBounds.left + info.nextDistance <= 0) {
                        info.optimal = this._entity.Position.x;
                        return true;
                    }

                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let leftColMin = Math.floor(entityBounds.left / tileWidth);
                    let leftColMax = Math.floor((entityBounds.left + info.nextDistance % tileWidth) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x, entityBounds.y + 0.1, entityBounds.width, entityBounds.height - 0.2);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftColMax, GameMap.MapInfo.width * i + leftColMin + 1);
                        for (let n = blocks.length - 1; n >= 0; n--) {
                            const block = blocks[n];
                            if (block && block.IsValid && block.BlockTypes & BlockTypes.RightBlocked && block.Bounds.intersects(tmpEntityBounds)) {
                                info.optimal = block.Bounds.right + entityBounds.width / 2;
                                return true;
                            }
                        }
                    }

                    // Check collision with other polygons
                    for (const poly of GameMap.PolyBlocks) {
                        if (poly.BlockTypes & BlockTypes.RightBlocked && poly.Polygon.intersectsRect(tmpEntityBounds)) {
                            return true;
                        }
                    }
                    break;
                case BoxDirection.Right:
                    if (entityBounds.right + info.nextDistance >= GameMap.Width) {
                        info.optimal = this._entity.Position.x;
                        return true;
                    }

                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let rightColMin = Math.floor(entityBounds.right / tileWidth);
                    let rightColMax = Math.floor((entityBounds.right + info.nextDistance % tileWidth) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x, entityBounds.y + 0.1, entityBounds.width, entityBounds.height - 0.2);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + rightColMin, GameMap.MapInfo.width * i + rightColMax + 1);
                        for (let n = 0; n < blocks.length; n++) {
                            const block = blocks[n];
                            if (block && block.IsValid && block.BlockTypes & BlockTypes.LeftBlocked && block.Bounds.intersects(tmpEntityBounds)) {
                                info.optimal = block.Bounds.left - entityBounds.width / 2;
                                return true;
                            }
                        }
                    }

                    // Check collision with other polygons
                    for (const poly of GameMap.PolyBlocks) {
                        if (poly.BlockTypes & BlockTypes.LeftBlocked && poly.Polygon.intersectsRect(tmpEntityBounds)) {
                            return true;
                        }
                    }
                    break;
            }
        }

        return false;
    }
}