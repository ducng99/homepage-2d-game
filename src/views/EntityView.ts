import Entity from '../models/Entity'
import * as PIXI from 'pixi.js'

export default class EntityView {
    private _entity: Entity;
    get Entity() { return this._entity }

    private _textures: PIXI.Texture<PIXI.Resource>[] = [];
    get Textures() {
        return this._textures;
    }
    
    private CurrentSprite?: PIXI.Sprite;
    
    private IsReady = false;
    private Scale: number;

    private constructor(entity: Entity, scale: number) {
        this._entity = entity;
        this.Scale = scale;
    }

    static async Load(entity: Entity, jsonPath: string, scale = 1) {
        const instance = new EntityView(entity, scale);

        try {
            await new Promise(resolve => {
                PIXI.Loader.shared.add(jsonPath).load(() => {
                    const textures = PIXI.Loader.shared.resources[jsonPath].textures;

                    if (textures) {
                        Object.values(textures).forEach(texture => {
                            // Init first sprite
                            if (!instance.CurrentSprite) {
                                instance.CurrentSprite = new PIXI.Sprite(texture);
                            }
                            
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            instance.Textures.push(texture);
                        });
                    }

                    instance.IsReady = true;
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
    
    Update(rootContainer: PIXI.Container) {
        if (this.IsReady && this.CurrentSprite) {
            this.CurrentSprite.scale.set(this.Scale, this.Scale);
            this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);
            
            rootContainer.addChild(this.CurrentSprite);
        }
    }
}