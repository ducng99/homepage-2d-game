import { Sprite } from 'pixi.js'
import Renderer from '../views/Renderer';
import MapManager from '../views/textures_mgr/MapManager';
import TilesetManager from '../views/textures_mgr/TilesetManager';
import MapBlock from './MapBlock'

export default class GameMap {
    private _backgroundSprite: Sprite;
    get BackgroundSprite() { return this._backgroundSprite }

    private _mapManager?: MapManager;
    get MapManager() { return this._mapManager }

    private _terrainBlocks: MapBlock[] = [];
    get TerrainBlocks() { return this._terrainBlocks }

    constructor() {
        this._backgroundSprite = Sprite.from('/assets/bg.png');
        this._backgroundSprite.width = Renderer.Instance.App.screen.width;
        this._backgroundSprite.height = Renderer.Instance.App.screen.height;

        this.InitTextures();
    }

    private async InitTextures() {
        const tileset_mgr = await TilesetManager.Load('/assets/maps/blocks.json');
        this._mapManager = await MapManager.Load('/assets/maps/map1.json');
        this._terrainBlocks = this._mapManager.Init(tileset_mgr);

        Renderer.Instance.MainContainer.addChildAt(this._mapManager.SpritesContainer, 1);

        // Match center in the view
        Renderer.Instance.MainContainer.position.y -= (this._mapManager.Height * Renderer.Instance.MainContainer.scale.y - Renderer.Instance.App.screen.height) / 2;
    }
}