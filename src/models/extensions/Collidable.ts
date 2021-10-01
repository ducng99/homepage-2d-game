import { Rectangle } from 'pixi.js';
import CollisionController from '../../controllers/CollisionController'

export default abstract class Collidable {
    private _collisionController?: CollisionController;
    
    get CollisionController() {
        if (!this._collisionController) {
            this._collisionController = new CollisionController(this);
        }
        
        return this._collisionController;
    }
    
    abstract get Bounds(): Rectangle;
}