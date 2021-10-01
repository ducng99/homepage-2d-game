import InputHandler from "../InputHandler";
import GameMap from "./Map";
import Player from "./Player";
import Entity from "./Entity";

export default class GameBrain {
    private static _instance?: GameBrain;
    static get Instance() {
        if (!this._instance) {
            this._instance = new GameBrain;
        }

        return this._instance;
    }

    static DestroyInstance() {
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
    
    private _entitiesList: Entity[] = [];
    get EntitiesList() {
        return this._entitiesList;
    }

    private constructor() {
        this._player = new Player;
        this.EntitiesList.push(this._player);
        this._map = new GameMap;
    }

    Update() {
        InputHandler.Instance.Handle();
        
        for (let i = 0; i < this.EntitiesList.length; i++) {
            this.EntitiesList[i].Update();
        }
    }
}