import * as PIXI from 'pixi.js';

export default class TextureManager {
    private constructor() { }

    private _textures: PIXI.Texture<PIXI.Resource>[] = [];
    get Textures() {
        return this._textures;
    }

    static async Load(jsonPath: string) {
        const instance = new TextureManager;
        const Loader = new PIXI.Loader;

        try {
            await new Promise(resolve => {
                Loader.add(jsonPath).load(() => {
                    const textures = Loader.resources[jsonPath].textures;

                    if (textures) {
                        // forEach is 50 times faster than for...in ¯\_(ツ)_/¯
                        Object.values(textures).forEach(texture => {
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            instance.Textures.push(texture);
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

        return instance;
    }
}