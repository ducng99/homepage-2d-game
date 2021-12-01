import * as PIXI from 'pixi.js';

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
        const Loader = new PIXI.Loader();

        try {
            await new Promise(resolve => {
                Loader.add(jsonPath).load((_, resources) => {
                    const textures = resources[jsonPath].textures;

                    if (textures) {
                        Object.values(textures).forEach(texture => {
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            this.Textures.push(texture);
                        });
                    }

                    resolve(undefined);
                });
            });
        }
        catch (error) {
            console.error(`Failed when loading texture from ${jsonPath}`);
            throw error;
        }
    }
}