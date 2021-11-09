import * as PIXI from 'pixi.js'
import Renderer from '../../views/Renderer'
import GameMap from './Map'
import TilesetManager from './TilesetManager'
import MapBlock from './MapBlock'

export default class MapManager {
    private _gameMap?: GameMap;
    get GameMap() { return this._gameMap }

    private _terrainBlocks: MapBlock[] = [];
    get TerrainBlocks() { return this._terrainBlocks }
    
    get Width() { return this.GameMap?.Width ?? 0 }
    get Height() { return this.GameMap?.Height ?? 0 }

    constructor() {

        this.InitTextures();
    }

    private async InitTextures() {
        const tileset_mgr = await TilesetManager.Load('/assets/maps/cyber-street.json');
        this._gameMap = await GameMap.Load('/assets/maps/map1.json');
        this._terrainBlocks = this._gameMap.Init(tileset_mgr);

        Renderer.Instance.MapContainer.addChild(this._gameMap.SpritesContainer);
    }
}