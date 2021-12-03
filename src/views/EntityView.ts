import Entity from '../models/Entity'
import * as PIXI from 'pixi.js'
import AnimationsManager from './AnimationsManager'
import Renderer from './Renderer';
import Observable from '../utils/Observable'
import SpriteSheetManager from '../utils/SpriteSheetManager'

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

    get Size() {
        return { width: this.CurrentSprite.width, height: this.CurrentSprite.height };
    }

    private constructor(entity: Entity) {
        this.Entity = entity;

        this.CurrentSprite = new PIXI.Sprite;
        this.CurrentSprite.anchor.x = 0.5;
        this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);

        this.FlipX.addListener(() => {
            this.CurrentSprite.scale.x *= -1;
        });
        this.FlipY.addListener(() => {
            this.CurrentSprite.scale.y *= -1;
        });

        Renderer.Instance.EntitiesContainer.addChild(this.CurrentSprite);
    }

    static async Load(entity: Entity, jsonPath: string) {
        const instance = new EntityView(entity);

        try {
            const resources = await SpriteSheetManager.Instance.Load(jsonPath);
            const textures = resources.textures;
            instance.AnimationsManager = new AnimationsManager(resources.spritesheet?.animations);

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
        }
        catch (error) {
            console.error(`Failed when loading texture from ${jsonPath}`);
            throw error;
        }

        return instance;
    }

    Update() {
        let textureApplied = false;

        if (this.AnimationsManager) {
            this.AnimationsManager.Update();

            if (this.AnimationsManager.CurrentTexture) {
                this.CurrentSprite.texture = this.AnimationsManager.CurrentTexture;
                textureApplied = true;
            }
        }

        if (!textureApplied && this.DefaultTexture) {
            this.CurrentSprite.texture = this.DefaultTexture;
        }

        this.CurrentSprite.position.set(this.Entity.Position.x, this.Entity.Position.y);
    }

    Destroy() {
        Renderer.Instance.EntitiesContainer.removeChild(this.CurrentSprite);
    }
}