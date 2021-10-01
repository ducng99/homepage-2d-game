import * as PIXI from 'pixi.js';
import EntityView from './EntityView'
import GameBrain from '../models/GameBrain';
import InputHandler from '../InputHandler';

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

    private Scale = 3;
    
    private EntityViews: EntityView[] = [];

    private constructor() {
        this.App = new PIXI.Application();
        this.App.renderer.view.style.position = "absolute";
        this.App.renderer.view.style.display = "block";
        this.App.resizeTo = window;
        this.App.stage.scale.set(this.Scale);
        
        this.App.view.setAttribute('tabindex', '1');
        
        this.App.view.addEventListener('keydown', (event) => {
            InputHandler.Instance.OnKeyDown(event.key);
        });
        this.App.view.addEventListener('keyup', (event) => {
            InputHandler.Instance.OnKeyUp(event.key);
        });

        document.querySelector('.App')!.appendChild(this.App.view);
    }

    async Init() {
        this.App.stage.addChildAt(GameBrain.Instance.Map.BackgroundSprite, 0);

        const playerView = await EntityView.Load(GameBrain.Instance.Player, '/assets/entities/player.json');
        this.EntityViews.push(playerView);
        
        this.App.ticker.add(delta => {
            this._timerDelta = delta;
            
            this.Update();
        });
    }
    
    private Update() {
        GameBrain.Instance.Update();
        
        this.EntityViews.forEach(view => {
            view.Update();
        });
    }
}