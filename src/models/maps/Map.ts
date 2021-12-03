import { MapStruct, Name as MapProperty } from './MapStruct'
import TilesetManager from './TilesetManager'
import * as PIXI from 'pixi.js'
import MapBlock from './MapBlock'
import BlockTypes from './BlockTypes';
import LineBlock from './LineBlock'
import Pie from '../entities/interactables/Pie'
import Interactable from '../extensions/Interactable';
import Line from '../../utils/Line'

export default class GameMap {
    private constructor() { }

    private _mapInfo?: MapStruct;
    get MapInfo() { return this._mapInfo }

    /**
     * Get map's height in pixels
     */
    get Height() {
        return (this.MapInfo?.height ?? 0) * (this.MapInfo?.tileheight ?? 0);
    }

    /**
     * Get map's width in pixels
     */
    get Width() {
        return (this.MapInfo?.width ?? 0) * (this.MapInfo?.tilewidth ?? 0);
    }

    readonly SpritesContainer: PIXI.Container = new PIXI.Container;

    static async Load(jsonPath: string) {
        const instance = new GameMap;

        try {
            const mapData = (await (await fetch(jsonPath)).json()) as MapStruct;
            instance._mapInfo = mapData;

            return instance;
        }
        catch (error) {
            console.error(`Failed when loading map from ${jsonPath}`);
            throw error;
        }
    }

    Init(): [MapBlock[], LineBlock[], Interactable[]] {
        const mapBlocks: MapBlock[] = [];
        const lineBlocks: LineBlock[] = [];
        const interactableObjs: Interactable[] = [];

        const terrainLayer = this.MapInfo!.layers.find(layer => layer.name === "Terrain");
        if (terrainLayer && terrainLayer.data && terrainLayer.height) {
            for (let row = 0; row < terrainLayer.height; row++) {
                const rowData = terrainLayer.data.splice(0, terrainLayer.width);

                rowData.forEach((textureID, col) => {
                    mapBlocks.push(new MapBlock());

                    if (textureID > 0) {
                        const sprite = new PIXI.Sprite(TilesetManager.Instance.Textures[textureID - 1]);
                        sprite.x = col * sprite.texture.width;
                        sprite.y = row * sprite.texture.height;
                        this.SpritesContainer.addChild(sprite);
                    }
                });
            }
        }
        
        const backgroundLayer = this.MapInfo!.layers.find(layer => layer.name === "Background");
        if (backgroundLayer && backgroundLayer.data && backgroundLayer.height) {
            for (let row = 0; row < backgroundLayer.height; row++) {
                const rowData = backgroundLayer.data.splice(0, backgroundLayer.width);

                rowData.forEach((textureID, col) => {
                    if (textureID > 0) {
                        const sprite = new PIXI.Sprite(TilesetManager.Instance.Textures[textureID - 1]);
                        sprite.x = col * sprite.texture.width;
                        sprite.y = row * sprite.texture.height;
                        this.SpritesContainer.addChild(sprite);
                    }
                });
            }
        }

        const blocksCollisionsLayer = this.MapInfo!.layers.find(layer => layer.name === "BlocksCollisions");
        if (blocksCollisionsLayer && blocksCollisionsLayer.objects) {
            blocksCollisionsLayer.objects.forEach(collBlock => {
                const mapBlockIndex = Math.floor(collBlock.y / this.MapInfo!.tileheight * this.MapInfo!.width + collBlock.x / this.MapInfo!.tilewidth);

                if (mapBlockIndex < mapBlocks.length) {
                    mapBlocks[mapBlockIndex].Bounds = new PIXI.Rectangle(collBlock.x, collBlock.y, collBlock.width, collBlock.height);
                    if (collBlock.properties) {
                        collBlock.properties.forEach(prop => {
                            if (prop.name === MapProperty.TopBlocked && prop.value)
                                mapBlocks[mapBlockIndex].BlockTypes |= BlockTypes.TopBlocked;
                            if (prop.name === MapProperty.BottomBlocked && prop.value)
                                mapBlocks[mapBlockIndex].BlockTypes |= BlockTypes.BottomBlocked;
                            if (prop.name === MapProperty.LeftBlocked && prop.value)
                                mapBlocks[mapBlockIndex].BlockTypes |= BlockTypes.LeftBlocked;
                            if (prop.name === MapProperty.RightBlocked && prop.value)
                                mapBlocks[mapBlockIndex].BlockTypes |= BlockTypes.RightBlocked;
                        });
                    }
                }
            });
        }

        const lineCollisionsLayer = this.MapInfo!.layers.find(layer => layer.name === "LineCollisions");
        if (lineCollisionsLayer && lineCollisionsLayer.objects) {
            lineCollisionsLayer.objects.forEach(collBlock => {
                if (collBlock.polyline && collBlock.properties) {
                    const points = collBlock.polyline.map(point => new PIXI.Point(point.x + collBlock.x, point.y + collBlock.y));
                    const lineBlock = new LineBlock(new Line(points[0], points[1]));

                    collBlock.properties.forEach(prop => {
                        if (prop.name === MapProperty.TopBlocked && prop.value)
                            lineBlock.BlockTypes |= BlockTypes.TopBlocked;
                        if (prop.name === MapProperty.BottomBlocked && prop.value)
                            lineBlock.BlockTypes |= BlockTypes.BottomBlocked;
                        if (prop.name === MapProperty.LeftBlocked && prop.value)
                            lineBlock.BlockTypes |= BlockTypes.LeftBlocked;
                        if (prop.name === MapProperty.RightBlocked && prop.value)
                            lineBlock.BlockTypes |= BlockTypes.RightBlocked;
                    });

                    lineBlocks.push(lineBlock);
                }
            });
        }

        const interactableObjsLayer = this.MapInfo!.layers.find(layer => layer.name === "InteractableObjects");
        if (interactableObjsLayer && interactableObjsLayer.objects) {
            interactableObjsLayer.objects.forEach(obj => {
                if (obj.properties) {
                    obj.properties.forEach(prop => {
                        if (prop.name === MapProperty.IsPie && prop.value) {
                            const pie = new Pie;
                            pie.Position.x = obj.x;
                            pie.Position.y = obj.y;
                            
                            interactableObjs.push(pie);
                        }
                    });
                }
            });
        }

        return [mapBlocks, lineBlocks, interactableObjs];
    }
}