import * as PIXI from 'pixi.js'
import Renderer from '../views/Renderer';
import MapManager from '../views/textures_mgr/MapManager';
import TilesetManager from '../views/textures_mgr/TilesetManager';
import Collidable from './extensions/Collidable';
import MapBlock from './MapBlock'
import '@pixi/math-extras'
import { Mixin } from 'ts-mixer';
import Entity from './Entity';

export default class GameMap {
    private _backgroundSprite: PIXI.Sprite;
    get BackgroundSprite() { return this._backgroundSprite }

    private _mapManager?: MapManager;
    get MapManager() { return this._mapManager }

    private _terrainBlocks: MapBlock[] = [];
    get TerrainBlocks() { return this._terrainBlocks }

    constructor() {
        this._backgroundSprite = PIXI.Sprite.from('/assets/bg.png');
        this._backgroundSprite.width = Renderer.Instance.App.screen.width;
        this._backgroundSprite.height = Renderer.Instance.App.screen.height;

        this.InitTextures();
    }

    private async InitTextures() {
        const tileset_mgr = await TilesetManager.Load('/assets/maps/blocks.json');
        this._mapManager = await MapManager.Load('/assets/maps/map1.json');
        this._terrainBlocks = this._mapManager.Init(tileset_mgr);

        // Match center in the view
        Renderer.Instance.App.stage.position.y -= this._mapManager.Height / 2;

        Renderer.Instance.App.stage.addChildAt(this._mapManager.SpritesContainer, 1);
    }
}