import * as PIXI from 'pixi.js';
import TextureManager from './textures_mgr/TilesetManager';
import MapManager from './textures_mgr/MapManager'
import EntityView from './EntityView'
import GameBrain from '../models/GameBrain';

export default class Renderer {
    private static _instance?: Renderer;
    static get Instance() {
        if (!this._instance) {
            this._instance = new Renderer;
        }

        return this._instance;
    }

    readonly App: PIXI.Application;
    get FPS() { return this.App.ticker.FPS }

    private _timerDelta = 0;
    get TimerDelta() { return this._timerDelta }

    Scale = 3;
    
    private EntityViews: EntityView[] = [];

    private constructor() {
        this.App = new PIXI.Application();
        this.App.renderer.view.style.position = "absolute";
        this.App.renderer.view.style.display = "block";
        this.App.resizeTo = window;

        document.querySelector('.App')!.appendChild(this.App.view);

        this.App.ticker.add(delta => {
            this._timerDelta = delta;
            
            this.Update();
        });

        this.Init();
    }

    private async Init() {
        const bgSprite = PIXI.Sprite.from('/assets/bg.png');
        bgSprite.width = this.App.view.width;
        bgSprite.height = this.App.screen.height;
        this.App.stage.addChildAt(bgSprite, 0);

        const textures_mgr = await TextureManager.Load('/assets/maps/blocks.json');
        const map_mgr = await MapManager.Load('/assets/maps/map1.json');
        map_mgr.Init(textures_mgr);
        map_mgr.SpritesContainer.scale.set(this.Scale, this.Scale);

        // Match center in the view
        map_mgr.SpritesContainer.position.y -= (map_mgr.Height - this.App.view.height) / 2;

        this.App.stage.addChild(map_mgr.SpritesContainer);

        const playerView = await EntityView.Load(GameBrain.Instance.Player, '/assets/entities/player.json', this.Scale);
        this.EntityViews.push(playerView);
    }
    
    private Update() {
        GameBrain.Instance.Update();
        
        this.EntityViews.forEach(view => {
            view.Update(this.App.stage);
        });
    }
}