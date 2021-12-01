import { MapStruct, Name as MapProperty } from './MapStruct'
import TilesetManager from './TilesetManager'
import * as PIXI from 'pixi.js'
import MapBlock from './MapBlock'
import BlockTypes from './BlockTypes';
import PolygonBlock from './PolygonBlock'
import Pie from '../entities/interactables/Pie'
import Interactable from '../extensions/Interactable';

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

    readonly SpritesContainer: PIXI.ParticleContainer = new PIXI.ParticleContainer(1500, {});

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

    Init(): [MapBlock[], PolygonBlock[], Interactable[]] {
        const mapBlocks: MapBlock[] = [];
        const polyBlocks: PolygonBlock[] = [];
        const interactableObjs: Interactable[] = [];

        const terrainLayer = this.MapInfo!.layers.find(layer => layer.name === "Terrain");
        if (terrainLayer && terrainLayer.data && terrainLayer.height) {
            const data = [...terrainLayer.data];   // splice will modify the original array -> create copy

            for (let row = 0; row < terrainLayer.height; row++) {
                const rowData = data.splice(0, terrainLayer.width);

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

        const polyCollisionsLayer = this.MapInfo!.layers.find(layer => layer.name === "PolyCollisions");
        if (polyCollisionsLayer && polyCollisionsLayer.objects) {
            polyCollisionsLayer.objects.forEach(collBlock => {
                if (collBlock.polygon && collBlock.properties) {
                    const polyBlock = new PolygonBlock(new PIXI.Polygon(...collBlock.polygon.map(point => new PIXI.Point(point.x + collBlock.x, point.y + collBlock.y))));

                    collBlock.properties.forEach(prop => {
                        if (prop.name === MapProperty.TopBlocked && prop.value)
                            polyBlock.BlockTypes |= BlockTypes.TopBlocked;
                        if (prop.name === MapProperty.BottomBlocked && prop.value)
                            polyBlock.BlockTypes |= BlockTypes.BottomBlocked;
                        if (prop.name === MapProperty.LeftBlocked && prop.value)
                            polyBlock.BlockTypes |= BlockTypes.LeftBlocked;
                        if (prop.name === MapProperty.RightBlocked && prop.value)
                            polyBlock.BlockTypes |= BlockTypes.RightBlocked;
                    });

                    polyBlocks.push(polyBlock);
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

        return [mapBlocks, polyBlocks, interactableObjs];
    }
}