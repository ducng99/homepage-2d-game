import * as PIXI from 'pixi.js'
import Renderer from '../../views/Renderer'
import GameMap from './Map'
import TilesetManager from './TilesetManager'
import MapBlock from './MapBlock'
import Camera from '../../views/Camera'

export default class MapManager {
    private _backgroundSprite: PIXI.Sprite;
    get BackgroundSprite() { return this._backgroundSprite }

    private _gameMap?: GameMap;
    get GameMap() { return this._gameMap }

    private _terrainBlocks: MapBlock[] = [];
    get TerrainBlocks() { return this._terrainBlocks }
    
    get Width() { return this.GameMap?.Width ?? 0 }
    get Height() { return this.GameMap?.Height ?? 0 }

    constructor() {
        this._backgroundSprite = PIXI.Sprite.from('/assets/bg.png');
        this._backgroundSprite.width = Renderer.Instance.App.screen.width;
        this._backgroundSprite.height = Renderer.Instance.App.screen.height;

        this.InitTextures();
    }

    private async InitTextures() {
        const tileset_mgr = await TilesetManager.Load('/assets/maps/blocks.json');
        this._gameMap = await GameMap.Load('/assets/maps/map1.json');
        this._terrainBlocks = this._gameMap.Init(tileset_mgr);

        Renderer.Instance.MainContainer.addChildAt(this._gameMap.SpritesContainer, 1);
    }
}