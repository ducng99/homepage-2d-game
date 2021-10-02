import { utils as PIXIUtils, Texture, Resource } from 'pixi.js'
import Renderer from './Renderer';

export default class AnimationManager {
    private Animations: PIXIUtils.Dict<Texture<Resource>[]>;

    private PlayingAnimationName = "";
    private PlayingAnimation?: Texture<Resource>[];
    private CurrentTextureInd = -1;
    get CurrentTexture() {
        return this.PlayingAnimation && this.PlayingAnimation.length > 0 && this.CurrentTextureInd >= 0
            ? this.PlayingAnimation[this.CurrentTextureInd]
            : undefined
    }

    private AnimationDelay = 100;
    private lastTick = 0;

    constructor(animations: PIXIUtils.Dict<Texture<Resource>[]>) {
        this.Animations = animations;
    }

    PlayAnimation(name: string) {
        if (this.PlayingAnimationName !== name && name in this.Animations) {
            this.PlayingAnimationName = name;
            this.PlayingAnimation = this.Animations[name];
            this.lastTick = 0;
            this.CurrentTextureInd = -1;
        }
    }

    StopAnimation() {
        this.PlayingAnimationName = "";
        this.PlayingAnimation = undefined;
    }

    Update() {
        if (this.PlayingAnimation) {
            this.lastTick += Renderer.Instance.App.ticker.deltaMS;

            if (this.lastTick >= this.AnimationDelay) {
                this.CurrentTextureInd = (this.CurrentTextureInd + 1) % this.PlayingAnimation.length;

                this.lastTick -= this.AnimationDelay;
            }
        }
    }
}