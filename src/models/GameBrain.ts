import InputHandler from "../InputHandler";
import GameMap from "./Map";
import Player from "./Player";
import { UpdateTick } from '../FPSCounter'

export default class GameBrain {
    private static _instance?: GameBrain;
    public static get Instance() {
        if (!this._instance) {
            this._instance = new GameBrain;
        }

        return this._instance;
    }

    public static DestroyInstance() {
        this._instance = undefined;
    }

    private _player: Player;
    get Player() {
        return this._player;
    }

    private _map: GameMap;
    get Map() {
        return this._map;
    }
    
    public UpdateView?: Function;

    private constructor() {
        this._player = new Player;
        this._map = new GameMap;
        setInterval(this.Update.bind(this), 1000 / 60);
    }

    private Update() {
        UpdateTick();
        InputHandler.Instance.Handle();
        
        if (this.UpdateView) {
            this.UpdateView();
        }
    }
}