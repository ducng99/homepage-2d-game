import { Layer, MapStruct } from './MapStruct'
import TilesetManager from './TilesetManager'
import Renderer from '../Renderer'
import * as PIXI from 'pixi.js'

export default class MapManager {
    private constructor() { }

    private _mapInfo?: MapStruct;
    get MapInfo() { return this._mapInfo }
    
    get Height() {
        return (this.MapInfo?.height ?? 0) * (this.MapInfo?.tileheight ?? 0) * this.SpritesContainer.scale.y;
    }
    get Width() {
        return (this.MapInfo?.width ?? 0) * (this.MapInfo?.tilewidth ?? 0) * this.SpritesContainer.scale.x;
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

    Init(textureMgr: TilesetManager) {
        this.MapInfo!.layers.forEach(layer => {
            const data = [...layer.data];   // splice will modify the original array -> create copy

            for (let col = 0; col < layer.height; col++) {
                const rowData = data.splice(0, layer.width);

                rowData.forEach((textureID, row) => {
                    if (textureID > 0) {
                        const sprite = new PIXI.Sprite(textureMgr.Textures[textureID - 1]);
                        sprite.x = row * sprite.texture.width;
                        sprite.y = col * sprite.texture.height;
                        this.SpritesContainer.addChild(sprite);
                    }
                });
            }
        });
    }
}