import Entity from '../models/Entity'
import * as PIXI from 'pixi.js'
import AnimationsManager from './AnimationsManager'
import Renderer from './Renderer';
import Observable from '../utils/Observable'

export default class EntityView {
    private readonly Entity: Entity;

    private _textures: PIXI.Texture<PIXI.Resource>[] = [];
    get Textures() {
        return this._textures;
    }

    AnimationsManager?: AnimationsManager;
    Rotation = 0;

    readonly FlipX = new Observable(false);
    readonly FlipY = new Observable(false);

    private DefaultTexture?: PIXI.Texture<PIXI.Resource>;
    private readonly CurrentSprite: PIXI.Sprite;

    private IsReady = false;
    get Size() {
        return { width: this.CurrentSprite.width, height: this.CurrentSprite.height };
    }

    private constructor(entity: Entity) {
        this.Entity = entity;
        this.Entity.View = this;

        this.CurrentSprite = new PIXI.Sprite;
        this.CurrentSprite.anchor.x = 0.5;
        this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);

        this.FlipX.onChange(() => {
            this.CurrentSprite.scale.x *= -1;
        });
        this.FlipY.onChange(() => {
            this.CurrentSprite.scale.y *= -1;
        });

        Renderer.Instance.MainContainer.addChild(this.CurrentSprite);
    }

    static async Load(entity: Entity, jsonPath: string) {
        const instance = new EntityView(entity);
        const Loader = new PIXI.Loader;

        try {
            await new Promise(resolve => {
                Loader.add(jsonPath).load(() => {
                    const textures = Loader.resources[jsonPath].textures;
                    instance.AnimationsManager = new AnimationsManager(Loader.resources[jsonPath].spritesheet?.animations);

                    if (textures) {
                        Object.values(textures).forEach(texture => {
                            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

                            // Init first sprite
                            if (!instance.DefaultTexture) {
                                instance.DefaultTexture = texture;
                            }

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

    Update() {
        if (this.IsReady) {
            if (this.DefaultTexture) {
                this.CurrentSprite.texture = this.DefaultTexture;
            }

            if (this.AnimationsManager) {
                this.AnimationsManager.Update();

                if (this.AnimationsManager.CurrentTexture)
                    this.CurrentSprite.texture = this.AnimationsManager.CurrentTexture;
            }

            this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);
        }
    }
}