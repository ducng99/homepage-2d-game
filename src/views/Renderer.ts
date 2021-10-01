import * as PIXI from 'pixi.js';
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
    }

    async Init() {
        this.App.stage.addChildAt(GameBrain.Instance.Map.BackgroundSprite, 0);

        const playerView = await EntityView.Load(GameBrain.Instance.Player, '/assets/entities/player.json', this.Scale);
        this.EntityViews.push(playerView);
    }
    
    private Update() {
        GameBrain.Instance.Update();
        
        this.EntityViews.forEach(view => {
            view.Update();
        });
    }
}