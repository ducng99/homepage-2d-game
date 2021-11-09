import * as PIXI from 'pixi.js'
import Vector2 from '../utils/Vector2';
import Renderer from './Renderer'

export default class ParallaxBackground {
    private Layers: PIXI.Sprite[] = [];

    constructor() {
        this.Layers.push(
            PIXI.Sprite.from('/assets/backgrounds/5.png'),
            PIXI.Sprite.from('/assets/backgrounds/3.png'),
            PIXI.Sprite.from('/assets/backgrounds/2.png'),
            PIXI.Sprite.from('/assets/backgrounds/1.png')
        );

        this.Layers.forEach(sprite => {
            sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            const ratio = sprite.width / sprite.height;

            sprite.height = Renderer.Instance.App.screen.height;
            sprite.width = sprite.height * ratio;
        });

        Renderer.Instance.BackgroundContainer.addChild(...this.Layers.reverse());
    }

    Update(cameraPosition: Vector2) {
        for (let i = 0; i < this.Layers.length; i++) {
            this.Layers[i].position.x = cameraPosition.x - 100 * i;
        }
    }
}