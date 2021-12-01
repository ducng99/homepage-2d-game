import Collidable from "./Collidable";

interface IOnInteractCallback {
    (entity: Collidable): void;
}

export default abstract class Interactable extends Collidable {
    private _onInteract?: IOnInteractCallback;
    
    protected set OnInteract(callback: IOnInteractCallback) {
        this._onInteract = callback;
    }
    
    protected RemoveCallback() {
        this._onInteract = undefined;
    }
    
    /**
     * Trigger interact event if the target entity is interactable and colliding with this entity
     * @param entity the target entity that will be interacted with
     * @returns true if the entity is interacted, false otherwise
     */
    Interact(entity: Collidable) {
        if (this._onInteract && this.CollisionController.IsCollidingWithEntity(entity)) {
            this._onInteract(entity);
            return true;
        }
        
        return false;
    }
}