import Collidable from "../../extensions/Collidable";
import Interactable from "../../extensions/Interactable";
import GameBrain from "../../GameBrain";
import Player from "../Player";

export default class Pie extends Interactable {
    static readonly VALUE = 10;
    
    private _interacted = false;
    get Interacted() {
        return this._interacted;
    }
    
    constructor() {
        super();
        // TODO: replace temp texture
        this.InitEntityView('/assets/entities/pie.json');
        this.OnInteract = this.OnInteractCallback.bind(this);
        
        GameBrain.Instance.EntitiesList.push(this);
    }
    
    Update() {
        if (!this.Interacted && this.View) {
            this.View.Update();
        }
    }
    
    private OnInteractCallback(entity: Collidable) {
        this.RemoveCallback();
        
        this._interacted = true;
        this.View?.Destroy();
        
        if (entity instanceof Player) {
            const player = entity as Player;
            
            player.ScoreManager.AddScore(Pie.VALUE);
        }
    }
}