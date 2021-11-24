import * as PIXI from 'pixi.js'
import GameBrain from '../models/GameBrain';
import Renderer from './Renderer'

export default class ParallaxBackground {
    private Layers = [new PIXI.Container, new PIXI.Container, new PIXI.Container, new PIXI.Container];
    private static readonly PARALLAX_BACKGROUND_SPEEDS = [0.95, 0.90, 0.87, 0.86];

    constructor() {
        const callback = (ready: boolean) => {
            if (ready) {
                GameBrain.Instance.MapManager.IsReady.removeListener(callback);
                this.Init();
            }
        }

        GameBrain.Instance.MapManager.IsReady.addListener(callback);

        // ! Specifically for the current map, shift background up a bit.
        Renderer.Instance.BackgroundContainer.position.y -= 64 * 3;
        Renderer.Instance.BackgroundContainer.addChild(...this.Layers);
    }

    private async Init() {
        const textures: PIXI.Texture[][] = [
            [await PIXI.Texture.fromURL('/assets/backgrounds/layer1/1.png')],
            [await PIXI.Texture.fromURL('/assets/backgrounds/layer2/1.png'), await PIXI.Texture.fromURL('/assets/backgrounds/layer2/2.png')],
            [await PIXI.Texture.fromURL('/assets/backgrounds/layer3/1.png'), await PIXI.Texture.fromURL('/assets/backgrounds/layer3/2.png')],
            [await PIXI.Texture.fromURL('/assets/backgrounds/layer4/1.png'), await PIXI.Texture.fromURL('/assets/backgrounds/layer4/2.png')]
        ];

        textures.forEach(t => {
            t.forEach(texture => {
                texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            });
        });

        // TODO: A better implementation would be to have enough sprites for each layer to fit the screen, and as one moves out of screen, it moves to the other side.
        for (let layerIndex = 0; layerIndex < this.Layers.length; layerIndex++) {
            const spritesCount = Math.round(GameBrain.Instance.MapManager.Width / textures[layerIndex][0].width);

            for (let i = 0; i < spritesCount; i++) {
                const texture = textures[layerIndex][Math.random() * textures[layerIndex].length | 0];
                const sprite = new PIXI.Sprite(texture);

                const ratio = texture.width / texture.height;
                sprite.height = Renderer.Instance.App.screen.height;
                sprite.width = sprite.height * ratio;
                sprite.position.x = i * sprite.width;

                this.Layers[layerIndex].addChild(sprite);
            }
        }
    }

    Update(cameraPositionX: number) {
        for (let i = 0; i < this.Layers.length; i++) {
            this.Layers[this.Layers.length - 1 - i].position.x = cameraPositionX * ParallaxBackground.PARALLAX_BACKGROUND_SPEEDS[i];
        }
    }
}