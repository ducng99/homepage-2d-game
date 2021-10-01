import { Sprite, Rectangle } from 'pixi.js';
import Collidable from './extensions/Collidable'

export default class MapBlock extends Collidable {
    private _sprite?: Sprite;
    get Sprite() { return this._sprite }

    set Sprite(value) {
        if (value) {
            this._sprite = value;
            this._bounds = new Rectangle(value.position.x, value.position.y, value.width, value.height);
        }
    }

    private _bounds = new Rectangle;

    constructor(sprite?: Sprite) {
        super();

        if (sprite) {
            this.Sprite = sprite;
        }
    }

    get IsValid() { return this.Sprite ? true : false }

    get Bounds() { return this._bounds }
}