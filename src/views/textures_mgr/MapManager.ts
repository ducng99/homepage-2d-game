import { MapStruct } from './MapStruct'
import TilesetManager from './TilesetManager'
import * as PIXI from 'pixi.js'
import MapBlock from '../../models/MapBlock';

export default class MapManager {
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

    static async Load(jsonPath: string) {
        const instance = new MapManager;

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

    Init(tilesetMgr: TilesetManager) {
        const mapBlocks: MapBlock[] = [];
        
        this.MapInfo!.layers.forEach(layer => {
            const data = [...layer.data];   // splice will modify the original array -> create copy

            for (let row = 0; row < layer.height; row++) {
                const rowData = data.splice(0, layer.width);

                rowData.forEach((textureID, col) => {
                    const block = new MapBlock;
                    if (textureID > 0) {
                        const sprite = new PIXI.Sprite(tilesetMgr.Textures[textureID - 1]);
                        sprite.x = col * sprite.texture.width;
                        sprite.y = row * sprite.texture.height;
                        this.SpritesContainer.addChild(sprite);
                        
                        block.Sprite = sprite;
                    }
                    mapBlocks.push(block);
                });
            }
        });
        
        return mapBlocks;
    }
}