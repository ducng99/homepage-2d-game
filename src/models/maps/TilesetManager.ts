import * as PIXI from 'pixi.js';

export default class TilesetManager {
    private static _instance: TilesetManager;
    static get Instance() {
        if (!this._instance) {
            this._instance = new TilesetManager();
        }

        return this._instance;
    }

    private constructor() { }

    private _textures: PIXI.Texture<PIXI.Resource>[] = [];
    get Textures() {
        return this._textures;
    }

    static async Load(jsonPath: string) {
        const Loader = new PIXI.Loader;

        try {
            await new Promise(resolve => {
                Loader.add(jsonPath).load(() => {
                    const textures = Loader.resources[jsonPath].textures;

                    if (textures) {
                        Object.values(textures).forEach(texture => {
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            this.Instance.Textures.push(texture);
                        });
                    }

                    resolve(0);
                });
            });
        }
        catch (error) {
            console.error(`Failed when loading texture from ${jsonPath}`);
            throw error;
        }
    }
}