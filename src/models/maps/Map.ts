import { MapStruct } from './MapStruct'
import TilesetManager from './TilesetManager'
import * as PIXI from 'pixi.js'
import MapBlock from './MapBlock'
import BlockTypes from './BlockTypes';
import PolygonBlock from './PolygonBlock'

const MapProperty = {
    TopBlocked: "top_blocked",
    BottomBlocked: "bottom_blocked",
    LeftBlocked: "left_blocked",
    RightBlocked: "right_blocked"
}

export default class GameMap {
    private constructor() { }

    private _mapInfo?: MapStruct;
    get MapInfo() { return this._mapInfo }

    get Height() {
        return (this.MapInfo?.height ?? 0) * (this.MapInfo?.tileheight ?? 0);
    }
    get Width() {
        return (this.MapInfo?.width ?? 0) * (this.MapInfo?.tilewidth ?? 0);
    }

    private _spritesContainer: PIXI.ParticleContainer = new PIXI.ParticleContainer(1500, {});
    get SpritesContainer() { return this._spritesContainer }

    private _polyBlocks: PolygonBlock[] = []
    get PolyBlocks() { return this._polyBlocks }

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

    Init() {
        const mapBlocks: MapBlock[] = [];

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

                    this.PolyBlocks.push(polyBlock);
                }
            });
        }

        return mapBlocks;
    }
}