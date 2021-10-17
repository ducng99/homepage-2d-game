import CollisionController from '../../controllers/CollisionController'
import Entity from '../Entity';
import * as PIXI from 'pixi.js'

export default abstract class Collidable extends Entity {
    private _collisionController?: CollisionController;

    get CollisionController() {
        if (!this._collisionController) {
            this._collisionController = new CollisionController(this);
        }

        return this._collisionController;
    }
    
    protected _isOnGround = false;
    /**
     * Indicates whether the entity is standing on terrain
     */
    get IsOnGround() { return this._isOnGround }

    /**
     * Get bounding box of the entity. This assumes entity's view X-axis is already anchored to center (originalX + width / 2)
     */
    get Bounds() {
        const width = this.View?.Size.width ?? 0;
        // Entity view's X is anchored to center
        return new PIXI.Rectangle(this.Position.x - width / 2, this.Position.y, width, this.View?.Size.height ?? 0);
    }
}