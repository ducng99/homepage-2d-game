import Collidable from "./Collidable";

export interface IOnInteractCallback {
    (entity: Collidable): void;
}

export default abstract class Interactable extends Collidable {
    protected abstract OnInteract: IOnInteractCallback;
    
    protected _interacted = false;
    
    /**
     * Trigger interact event if the target entity is interactable and colliding with this entity
     * @param entity the target entity that will be interacted with
     * @returns true if the entity is interacted, false otherwise
     */
    Interact(entity: Collidable) {
        if (!this._interacted && this.CollisionController.IsCollidingWithEntity(entity)) {
            this.OnInteract(entity);
            this._interacted = true;
            return true;
        }
        
        return false;
    }
}