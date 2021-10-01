import Entity from '../models/Entity'
import * as PIXI from 'pixi.js'
import AnimationsManager from './AnimationsManager'
import Renderer from './Renderer';
import ObservableObj from '../utils/ObservableObj'

export default class EntityView {
    private _entity: Entity;
    get Entity() { return this._entity }

    private _textures: PIXI.Texture<PIXI.Resource>[] = [];
    get Textures() {
        return this._textures;
    }

    AnimationsManager?: AnimationsManager;
    Rotation = 0;

    FlipX = new ObservableObj(false);
    FlipY = new ObservableObj(false);

    private DefaultTexture?: PIXI.Texture<PIXI.Resource>;
    private CurrentSprite: PIXI.Sprite;

    private IsReady = false;
    get Bounds() { 
        const pos = this.Entity.Position;
        return new PIXI.Rectangle(pos.x - this.CurrentSprite.width / 2, pos.y, this.CurrentSprite.width, this.CurrentSprite.height);
    }

    private constructor(entity: Entity) {
        this._entity = entity;
        this._entity.View = this;

        this.CurrentSprite = new PIXI.Sprite;
        this.CurrentSprite.anchor.x = 0.5;
        this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);

        this.FlipX.onChange(() => {
            this.CurrentSprite.scale.x *= -1;
        });
        this.FlipY.onChange(() => {
            this.CurrentSprite.scale.y *= -1;
        });

        Renderer.Instance.App.stage.addChild(this.CurrentSprite);
    }

    static async Load(entity: Entity, jsonPath: string) {
        const instance = new EntityView(entity);
        const Loader = new PIXI.Loader;

        try {
            await new Promise(resolve => {
                Loader.add(jsonPath).load(() => {
                    const textures = Loader.resources[jsonPath].textures;
                    instance.AnimationsManager = new AnimationsManager(Loader.resources[jsonPath].spritesheet!.animations);

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