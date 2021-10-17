import * as PIXI from 'pixi.js';
import Collidable from '../extensions/Collidable'
import BlockTypes from './BlockTypes'

export default class MapBlock extends Collidable {
    private _bounds = new PIXI.Rectangle; 
    get Bounds() { return this._bounds }
    set Bounds(value) {
        this._bounds = value;
    }
    
    BlockTypes: number = BlockTypes.None;

    constructor() {
        super();
    }

    get IsValid() { return this.Bounds.width > 0 && this.Bounds.height > 0 }
    
    Update() {
        // TODO: Interactable block logic
    }
}