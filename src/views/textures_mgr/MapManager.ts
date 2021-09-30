import { Layer, MapStruct } from './MapStruct'
import TilesetManager from './TilesetManager'
import Renderer from '../Renderer'
import * as PIXI from 'pixi.js'

export default class MapManager {
    private constructor() { }

    private Layers: Layer[] = []
    private _spritesContainer: PIXI.ParticleContainer = new PIXI.ParticleContainer(1500, {});

    get SpritesContainer() { return this._spritesContainer }

    static async Load(jsonPath: string) {
        const instance = new MapManager;

        try {
            const mapData = (await (await fetch(jsonPath)).json()) as MapStruct;
            instance.Layers = mapData.layers;

            return instance;
        }
        catch (error) {
            console.error(`Failed when loading map from ${jsonPath}`);
            throw error;
        }
    }

    Init(textureMgr: TilesetManager) {
        this.Layers.forEach(layer => {
            const data = [...layer.data];   // splice will modify the original array

            for (let col = 0; col < layer.height; col++) {
                const rowData = data.splice(0, layer.width);    // because splice cuts off the original array for us, we always start from 0

                for (let row = 0; row < layer.width; row++) {
                    const textureID = rowData[row];

                    if (textureID > 0) {
                        const sprite = new PIXI.Sprite(textureMgr.Textures[textureID - 1]);
                        sprite.x = row * sprite.texture.width * 1.5;
                        sprite.y = col * sprite.texture.height * 1.5;
                        sprite.scale.x = 1.5;
                        sprite.scale.y = 1.5;
                        this.SpritesContainer.addChild(sprite);
                    }
                }
            }
        });
    }
}