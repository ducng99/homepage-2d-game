import * as PIXI from 'pixi.js';
import TextureManager from './textures_mgr/TilesetManager';
import MapManager from './textures_mgr/MapManager'

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
    
    private _frametime = 0;
    get FrameTime() { return this._frametime }
    
    Scale = 3;

    private constructor() {
        this.App = new PIXI.Application();
        this.App.renderer.view.style.position = "absolute";
        this.App.renderer.view.style.display = "block";
        this.App.resizeTo = window;

        document.querySelector('.App')!.appendChild(this.App.view);
        
        this.App.ticker.add(delta => {
            this._frametime = delta;
        })

        this.Init();
    }

    private Init() {
        TextureManager.Load('/assets/maps/blocks.json').then(textures_mgr => {
            MapManager.Load('/assets/maps/map1.json').then(map_mgr => {
                map_mgr.Init(textures_mgr);
                map_mgr.SpritesContainer.scale.set(this.Scale, this.Scale);
                
                // Match center in the view
                map_mgr.SpritesContainer.position.y -= (map_mgr.Height - this.App.view.height) / 2;
                
                this.App.stage.addChild(map_mgr.SpritesContainer);
            })
        });
    }
}