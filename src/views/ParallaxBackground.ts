import * as PIXI from 'pixi.js'
import GameBrain from '../models/GameBrain';
import Renderer from './Renderer'

export default class ParallaxBackground {
    private Layers = [new PIXI.Container, new PIXI.Container, new PIXI.Container, new PIXI.Container];
    private static readonly PARALLAX_BACKGROUND_SPEEDS = [0.05, 0.06, 0.07, 0.08];

    constructor() {
        const callback = (ready: boolean) => {
            if (ready) {
                GameBrain.Instance.MapManager.IsReady.removeListener(callback);
                this.Init();
            }
        }

        GameBrain.Instance.MapManager.IsReady.addListener(callback);

        Renderer.Instance.BackgroundContainer.addChild(...this.Layers);
    }

    private async Init() {
        const textures: PIXI.Texture[] = [
            await PIXI.Texture.fromURL('/assets/backgrounds/1.png'),
            await PIXI.Texture.fromURL('/assets/backgrounds/2.png'),
            await PIXI.Texture.fromURL('/assets/backgrounds/3.png'),
            await PIXI.Texture.fromURL('/assets/backgrounds/5.png'),
        ];

        textures.forEach(t => {
            t.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        });

        // TODO: A better implementation would be to have 3 sprites for each layer, and as one moves out of screen, it moves to the other side.
        for (let layerIndex = 0; layerIndex < this.Layers.length; layerIndex++) {
            const spritesCount = GameBrain.Instance.MapManager.Width / textures[layerIndex].width * 2;

            for (let i = 0; i < spritesCount; i++) {
                const sprite = new PIXI.Sprite(textures[layerIndex]);
                sprite.position.x = i * textures[layerIndex].width;
                
                const ratio = textures[layerIndex].width / textures[layerIndex].height;
                sprite.height = Renderer.Instance.App.screen.height;
                sprite.width = sprite.height * ratio;
                
                this.Layers[layerIndex].addChild(sprite);
            }
        }
    }

    Update(cameraPositionX: number) {
        for (let i = 0; i < this.Layers.length; i++) {
            this.Layers[this.Layers.length - 1 - i].position.x = cameraPositionX + (cameraPositionX * ParallaxBackground.PARALLAX_BACKGROUND_SPEEDS[i]) * i;
        }
    }
}