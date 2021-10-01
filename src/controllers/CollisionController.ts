import Collidable from "../models/extensions/Collidable";

export default class CollisionController {
    private entity: Collidable;
    
    constructor(entity: Collidable) {
        this.entity = entity;
    }
}