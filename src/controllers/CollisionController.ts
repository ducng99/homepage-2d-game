import Collidable from "../models/extensions/Collidable";
import * as PIXI from 'pixi.js'
import GameBrain from "../models/GameBrain";
import BlockTypes from "../models/maps/BlockTypes";
import Line from "../utils/Line";

export enum BoxDirection {
    Top, Bottom, Left, Right
}

export default class CollisionController {
    private readonly Entity: Collidable;

    constructor(entity: Collidable) {
        this.Entity = entity;
    }

    /**
     * Checking collision with map's terrain without looping all blocks.
     * From the bounds box of the entity, calculate which blocks the entity is sitting in (get specific rows and cols). Then loop through those blocks to check if it is valid (collidable)
     * @param direction which face the function will check (top, bottom, left, right)
     * @param info an object to receive the face optimal value before collision occurs
     * @returns an array:
     * - true if entity collides with terrain, false otherwise
     * - the face optimal value before collision occurs
     */
    IsCollidingTerrain(direction: BoxDirection, nextDistance: number): [boolean, number] {
        const entityBounds = this.Entity.Bounds;
        const GameMap = GameBrain.Instance.MapManager.GameMap;
        const TerrainBlocks = GameBrain.Instance.MapManager.TerrainBlocks;
        const LineBlocks = GameBrain.Instance.MapManager.LineBlocks;

        if (GameMap && GameMap.MapInfo) {
            const tileHeight = GameMap.MapInfo.tileheight;
            const tileWidth = GameMap.MapInfo.tilewidth;

            let topRow: number, bottomRow: number, leftCol: number, rightCol: number;
            let topPoint: PIXI.Point, bottomPoint: PIXI.Point, leftPoint: PIXI.Point, rightPoint: PIXI.Point;
            let playerCollisionLine: Line;
            let tmpEntityBounds: PIXI.Rectangle;

            switch (direction) {
                case BoxDirection.Top:
                    // If outside of map, return true to prevent moving
                    if (entityBounds.top + nextDistance <= 0) {
                        return [true, this.Entity.Position.y];
                    }

                    let topRowMin = Math.floor((entityBounds.top + nextDistance % tileHeight) / tileHeight);
                    let topRowMax = Math.floor(entityBounds.top / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    // Use this to check intersects
                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x + 0.1, entityBounds.y, entityBounds.width - 0.2, entityBounds.height);

                    for (let i = topRowMax; i >= topRowMin; i--) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid && row[n].BlockTypes & BlockTypes.BottomBlocked && row[n].Bounds.intersects(tmpEntityBounds)) {
                                return [true, row[n].Bounds.bottom];
                            }
                        }
                    }

                    // Check collision with other lines
                    topPoint = new PIXI.Point(tmpEntityBounds.width / 2 + tmpEntityBounds.left, tmpEntityBounds.top + nextDistance);
                    bottomPoint = new PIXI.Point(tmpEntityBounds.width / 2 + tmpEntityBounds.left, tmpEntityBounds.bottom);
                    playerCollisionLine = new Line(topPoint, bottomPoint);

                    for (let i = 0; i < LineBlocks.length; i++) {
                        const [isIntersect, intersectionPoint] = LineBlocks[i].Line.intersects(playerCollisionLine);
                        if (LineBlocks[i].BlockTypes & BlockTypes.BottomBlocked && isIntersect) {
                            return [true, intersectionPoint.y];
                        }
                    };

                    break;
                case BoxDirection.Bottom:
                    if (entityBounds.bottom + nextDistance >= GameMap.Height) {
                        return [true, this.Entity.Position.y];
                    }

                    let bottomRowMin = Math.floor(entityBounds.bottom / tileHeight);
                    let bottomRowMax = Math.floor((entityBounds.bottom + nextDistance % tileHeight) / tileHeight);
                    leftCol = Math.floor((entityBounds.left + 0.1) / tileWidth);
                    rightCol = Math.floor((entityBounds.right - 0.1) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x + 0.1, entityBounds.y, entityBounds.width - 0.2, entityBounds.height);

                    for (let i = bottomRowMin; i <= bottomRowMax; i++) {
                        const row = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftCol, GameMap.MapInfo.width * i + rightCol + 1);

                        for (let n = 0; n < row.length; n++) {
                            if (row[n].IsValid && row[n].BlockTypes & BlockTypes.TopBlocked && row[n].Bounds.intersects(tmpEntityBounds)) {
                                return [true, row[n].Bounds.top - entityBounds.height];
                            }
                        }
                    }

                    // Check collision with other lines
                    topPoint = new PIXI.Point(tmpEntityBounds.width / 2 + tmpEntityBounds.left, tmpEntityBounds.top);
                    bottomPoint = new PIXI.Point(tmpEntityBounds.width / 2 + tmpEntityBounds.left, tmpEntityBounds.bottom + nextDistance);
                    playerCollisionLine = new Line(topPoint, bottomPoint);

                    for (let i = 0; i < LineBlocks.length; i++) {
                        const [isIntersect, intersectionPoint] = LineBlocks[i].Line.intersects(playerCollisionLine);
                        if (LineBlocks[i].BlockTypes & BlockTypes.TopBlocked && isIntersect) {
                            return [true, intersectionPoint.y - entityBounds.height];
                        }
                    };

                    break;
                case BoxDirection.Left:
                    if (entityBounds.left + nextDistance <= 0) {
                        return [true, this.Entity.Position.x];
                    }

                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let leftColMin = Math.floor(entityBounds.left / tileWidth);
                    let leftColMax = Math.floor((entityBounds.left + nextDistance % tileWidth) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x, entityBounds.y + 0.1, entityBounds.width, entityBounds.height - 0.2);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + leftColMax, GameMap.MapInfo.width * i + leftColMin + 1);
                        for (let n = blocks.length - 1; n >= 0; n--) {
                            const block = blocks[n];
                            if (block && block.IsValid && block.BlockTypes & BlockTypes.RightBlocked && block.Bounds.intersects(tmpEntityBounds)) {
                                return [true, block.Bounds.right + entityBounds.width / 2];
                            }
                        }
                    }

                    // Check collision with other lines
                    leftPoint = new PIXI.Point(tmpEntityBounds.left + nextDistance, tmpEntityBounds.height / 2 + tmpEntityBounds.top);
                    rightPoint = new PIXI.Point(tmpEntityBounds.right, tmpEntityBounds.height / 2 + tmpEntityBounds.top);
                    playerCollisionLine = new Line(leftPoint, rightPoint);

                    for (let i = 0; i < LineBlocks.length; i++) {
                        const [isIntersect, intersectionPoint] = LineBlocks[i].Line.intersects(playerCollisionLine);
                        if (LineBlocks[i].BlockTypes & BlockTypes.RightBlocked && isIntersect) {
                            return [true, intersectionPoint.x + entityBounds.width / 2];
                        }
                    };

                    break;
                case BoxDirection.Right:
                    if (entityBounds.right + nextDistance >= GameMap.Width) {
                        return [true, this.Entity.Position.x];
                    }

                    topRow = Math.round((entityBounds.top + 0.1) / tileHeight);
                    bottomRow = Math.round((entityBounds.bottom - 0.1) / tileHeight);
                    let rightColMin = Math.floor(entityBounds.right / tileWidth);
                    let rightColMax = Math.floor((entityBounds.right + nextDistance % tileWidth) / tileWidth);

                    tmpEntityBounds = new PIXI.Rectangle(entityBounds.x, entityBounds.y + 0.1, entityBounds.width, entityBounds.height - 0.2);

                    for (let i = topRow; i < bottomRow; i++) {
                        const blocks = TerrainBlocks.slice(GameMap.MapInfo.width * i + rightColMin, GameMap.MapInfo.width * i + rightColMax + 1);
                        for (let n = 0; n < blocks.length; n++) {
                            const block = blocks[n];
                            if (block && block.IsValid && block.BlockTypes & BlockTypes.LeftBlocked && block.Bounds.intersects(tmpEntityBounds)) {
                                return [true, block.Bounds.left - entityBounds.width / 2];
                            }
                        }
                    }

                    // Check collision with other lines
                    leftPoint = new PIXI.Point(tmpEntityBounds.left, tmpEntityBounds.height / 2 + tmpEntityBounds.top);
                    rightPoint = new PIXI.Point(tmpEntityBounds.right + nextDistance, tmpEntityBounds.height / 2 + tmpEntityBounds.top);
                    playerCollisionLine = new Line(leftPoint, rightPoint);

                    for (let i = 0; i < LineBlocks.length; i++) {
                        const [isIntersect, intersectionPoint] = LineBlocks[i].Line.intersects(playerCollisionLine);
                        if (LineBlocks[i].BlockTypes & BlockTypes.LeftBlocked && isIntersect) {
                            return [true, intersectionPoint.x - entityBounds.width / 2];
                        }
                    };

                    break;
            }
        }

        return [false, 0];
    }

    /**
     * Checking whether the current entity is colliding with a target entity
     * @param entity the target entity to check for collision
     * @returns true if the entity is colliding with the target entity, false otherwise
     */
    IsCollidingWithEntity(entity: Collidable): boolean {
        return entity.Bounds.intersects(this.Entity.Bounds);
    }
}