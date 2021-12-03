import * as PIXI from 'pixi.js';
import SpriteSheetManager from '../../utils/SpriteSheetManager';

export default class TilesetManager {
    private static _instance: TilesetManager;
    static get Instance() {
        if (!this._instance) {
            this._instance = new TilesetManager();
        }

        return this._instance;
    }

    readonly Textures: PIXI.Texture<PIXI.Resource>[] = [];

    private constructor() { }

    async Load(jsonPath: string) {
        try {
            const resources = await SpriteSheetManager.Instance.Load(jsonPath);
            const textures = resources.textures;

            if (textures) {
                Object.values(textures).forEach(texture => {
                    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                    this.Textures.push(texture);
                });
            }
        }
        catch (error) {
            console.error(`Failed when loading texture from ${jsonPath}`);
            throw error;
        }
    }
}