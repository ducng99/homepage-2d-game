import * as PIXI from 'pixi.js';
import Collidable from '../extensions/Collidable'

export default class MapBlock extends Collidable {
    private _sprite?: PIXI.Sprite;
    get Sprite() { return this._sprite }

    set Sprite(value) {
        if (value) {
            this._sprite = value;
            this._bounds = new PIXI.Rectangle(value.position.x, value.position.y, value.width, value.height);
        }
    }

    private _bounds = new PIXI.Rectangle;

    constructor(sprite?: PIXI.Sprite) {
        super();

        if (sprite) {
            this.Sprite = sprite;
        }
    }

    get IsValid() { return this.Sprite && this.Bounds.width > 0 && this.Bounds.height > 0 }

    get Bounds() { return this._bounds }
}