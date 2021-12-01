import Renderer from '../../views/Renderer'
import GameMap from './Map'
import TilesetManager from './TilesetManager'
import MapBlock from './MapBlock'
import Observable from '../../utils/Observable';

export default class MapManager {
    private _gameMap?: GameMap;
    get GameMap() { return this._gameMap }

    private _terrainBlocks: MapBlock[] = [];
    get TerrainBlocks() { return this._terrainBlocks }

    get Width() { return this.GameMap?.Width ?? 0 }
    get Height() { return this.GameMap?.Height ?? 0 }

    readonly IsReady = new Observable(false);

    constructor() {
        this.Init();
    }

    private async Init() {
        await TilesetManager.Instance.Load('/assets/maps/cyber-street.json');
        await TilesetManager.Instance.Load('/assets/maps/residential.json');
        
        this._gameMap = await GameMap.Load('/assets/maps/map1.json');
        this._terrainBlocks = this._gameMap.Init();

        Renderer.Instance.MapContainer.addChild(this._gameMap.SpritesContainer);
        this.IsReady.Value = true;
    }
}